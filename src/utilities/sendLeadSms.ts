const PHONE_PATTERN = /^1\d{10}$/

/**
 * Sends the one-time "thanks for contacting us" SMS via the BulkVS REST
 * API. Called only from the form-submissions afterChange hook — never
 * directly reachable from the client — so the phone number always comes
 * from an actual saved lead record, not arbitrary request input.
 */
export async function sendLeadSms({
  phone,
  businessName,
}: {
  phone: string
  businessName: string
}): Promise<void> {
  if (!PHONE_PATTERN.test(phone)) {
    throw new Error(`Refusing to send SMS to malformed number: ${phone}`)
  }

  const apiUrl = process.env.BULKVS_API_URL
  const basicAuth = process.env.BULKVS_BASIC_AUTH
  const fromNumber = process.env.BULKVS_FROM_NUMBER

  if (!apiUrl || !basicAuth || !fromNumber) {
    throw new Error('BulkVS environment variables are not fully configured.')
  }

  const message = `Thanks for contacting ${businessName}! A member of our team will call you soon with your cash offer. Reply STOP to opt out.`

  const bulkVsRes = await fetch(`${apiUrl}/messageSend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${basicAuth}`,
    },
    body: JSON.stringify({
      From: fromNumber,
      To: [phone],
      Message: message,
    }),
  })

  if (!bulkVsRes.ok) {
    const errorBody = await bulkVsRes.text()
    throw new Error(`BulkVS returned ${bulkVsRes.status}: ${errorBody}`)
  }
}
