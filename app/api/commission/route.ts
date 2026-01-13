import { NextResponse } from 'next/server';

interface CommissionRequest {
  username: string;
  discordId: string;
  description: string;
  coolors: string;
  images: string[];
  packageType: string;
  frameCount: number;
  estimatedPrice: number;
}

interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface DiscordEmbed {
  title: string;
  color: number;
  fields: DiscordEmbedField[];
  footer: { text: string };
  timestamp: string;
  image?: { url: string };
}

interface DiscordPayload {
  content: string;
  embeds: (DiscordEmbed | { url: string; image: { url: string } })[];
}

export async function POST(req: Request) {
  try {
    const body: CommissionRequest = await req.json();
    const { 
      username, 
      discordId, 
      description, 
      coolors, 
      images, 
      packageType, 
      frameCount, 
      estimatedPrice 
    } = body;

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Format Price with commas
    const formattedPrice = new Intl.NumberFormat().format(estimatedPrice);

    const embed: DiscordEmbed = {
      title: "🎨 New Commission Request!",
      color: 0x3b82f6, 
      fields: [
        { name: "User", value: `${username} (<@${discordId}>)`, inline: true },
        { name: "Package", value: packageType, inline: true },
        { name: "Scope", value: `${frameCount} Frames`, inline: true },
        { name: "Est. Price", value: `R$ ${formattedPrice}`, inline: true },
        { name: "Coolors Palette", value: coolors || "None provided", inline: false },
        { name: "Description", value: description, inline: false },
      ],
      footer: { text: "Commission System via Website" },
      timestamp: new Date().toISOString()
    };

    const discordPayload: DiscordPayload = {
      content: `New commission from <@${discordId}>`,
      embeds: [embed]
    };

    // If there are images, add the first one as main image
    if (images && images.length > 0) {
      embed.image = { url: images[0] };
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