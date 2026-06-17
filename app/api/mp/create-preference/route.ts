import { NextRequest, NextResponse } from "next/server"
import MercadoPagoConfig, { Preference } from "mercadopago"
import { createSupabaseServerClient } from "@/lib/supabase/server"

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      nombre, email, telefono,
      ambiente, tipo, material, revestimiento,
      ancho, alto, instalacion, localidad,
      precio_puerta, precio_instalacion,
    } = body

    if (!nombre || !email || !precio_puerta) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const revLabel = revestimiento === "premium" ? " · Premium aluminio" : ""

    const items = [
      {
        id: `puerta-${tipo}`,
        title: `Puerta ${tipo === "corredera_simple" ? "Corrediza Simple" : "Plegable Doble"} — ${material}${revLabel} (${ancho}×${alto}cm)`,
        quantity: 1,
        unit_price: precio_puerta,
        currency_id: "ARS",
      },
    ]

    if (precio_instalacion) {
      items.push({
        id: "instalacion",
        title: `Instalación en ${localidad}`,
        quantity: 1,
        unit_price: precio_instalacion,
        currency_id: "ARS",
      })
    }

    const preference = new Preference(mp)
    const result = await preference.create({
      body: {
        items,
        payer: { name: nombre, email, phone: { number: telefono } },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/pending`,
        },
        auto_return: "approved",
        external_reference: `jk-${Date.now()}`,
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mp/webhook`,
      },
    })

    // Guardar lead en Supabase
    const supabase = await createSupabaseServerClient()
    await supabase.from("leads").insert({
      nombre, email, telefono,
      ambiente, tipo, material, revestimiento: revestimiento ?? "estandar",
      ancho, alto, instalacion, localidad,
      precio_puerta, precio_instalacion: precio_instalacion ?? null,
      mp_preference_id: result.id,
      status: "pendiente",
    })

    return NextResponse.json({ preference_id: result.id, init_point: result.init_point })
  } catch (err) {
    console.error("[MP create-preference]", err)
    return NextResponse.json({ error: "Error al crear preferencia" }, { status: 500 })
  }
}
