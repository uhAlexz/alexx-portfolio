import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, discordId, description, coolors, images } = await req.json();

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const embed = {
      title: "🎨 New Commission Request!",
      color: 0x3b82f6, 
      fields: [
        { name: "User", value: `${username} (<@${discordId}>)`, inline: true },
        { name: "Coolors Palette", value: coolors || "None provided" },
        { name: "Description", value: description },
      ],
      footer: { text: "Commission System via Website" },
      timestamp: new Date().toISOString()
    };

    // If there are images, add the first one as main image
    const discordPayload: any = {
      content: `New commission from <@${discordId}>`,
      embeds: [embed]
    };

    if (images && images.length > 0) {
        // @ts-ignore
        discordPayload.embeds[0].image = { url: images[0] };
    }

    // Add remaining images as extra embeds
    if (images && images.length > 1) {
      for (let i = 1; i < images.length; i++) {
        discordPayload.embeds.push({ url: images[i], image: { url: images[i] } });
      }
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload),
    });

    if (!response.ok) throw new Error('Failed to send to Discord');

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}