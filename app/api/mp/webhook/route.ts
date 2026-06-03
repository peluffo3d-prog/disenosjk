import { NextRequest, NextResponse } from "next/server"
import MercadoPagoConfig, { Payment } from "mercadopago"
import { createSupabaseAdminClient } from "@/lib/supabase/server"

const mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (body.type !== "payment") return NextResponse.json({ ok: true })

    const payment = new Payment(mp)
    const data = await payment.get({ id: body.data.id })

    if (!data.id) return NextResponse.json({ ok: true })

    const supabase = await createSupabaseAdminClient()
    await supabase
      .from("leads")
      .update({
        mp_payment_id: String(data.id),
        status: data.status === "approved" ? "pagado" : "pendiente",
      })
      .eq("mp_preference_id", data.external_reference?.replace("jk-", "") ?? "")

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[MP webhook]", err)
    return NextResponse.json({ ok: true }) // siempre 200 al webhook
  }
}
