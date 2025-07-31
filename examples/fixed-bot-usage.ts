import { MessageBuilder, ColorUtils } from '../src/index';
import { MessageFlags } from 'discord.js';

// Example of how to fix your bot code
export function fixedPingCommand() {
    // Create the loading message
    const loadingMessage = new MessageBuilder()
        .addText('🔄 **Pinging Ice Bear\'s API...**');

    // Method 1: Use V2 components with MessageFlags.IsComponentsV2 (RECOMMENDED)
    const replyV2 = {
        components: loadingMessage.buildForV2MessageSending(),
        flags: MessageFlags.IsComponentsV2
    };

    // Method 2: Use traditional components (fallback if V2 doesn't work)
    const replyTraditional = {
        components: loadingMessage.buildForTraditionalDiscordJS()
    };

    // Method 3: Use buildMessagePayload for complete message payload
    const messagePayload = loadingMessage.buildMessagePayload('🔄 **Pinging Ice Bear\'s API...**');
    
    return { replyV2, replyTraditional, messagePayload };
}

// Example of how to fix your createPingMessage function
export function createFixedPingMessage(wsLatency: number, editLatency: number, buttonDisabled = false) {
    const message = new MessageBuilder()
        .addContainer({
            accentColor: ColorUtils.hexToInt('#5865F2'),
            children: [
                { type: 'text', content: '🤖 **Ice Bear Performance Dashboard**' },
                { type: 'text', content: '────────────────────────────────' },
                { type: 'text', content: '🚀 **Network Performance**' },
                { type: 'text', content: `🟢 **WebSocket Ping:** \`${wsLatency}ms\` • *Excellent*` },
                { type: 'text', content: `🟢 **Message Edit:** \`${editLatency}ms\` • *Excellent*` },
                { type: 'text', content: '────────────────────────────────' },
                { type: 'text', content: '⏰ **System Information**' },
                { type: 'text', content: '⚙️ **Uptime:** \`1d 2h 30m 45s\`' }
            ]
        })
        .addButton({
            customId: 'ping_refresh',
            label: 'Refresh Metrics',
            style: 'primary',
            emoji: '🔄',
            disabled: buttonDisabled
        });

    // Return V2 components for use with MessageFlags.IsComponentsV2
    return {
        components: message.buildForV2MessageSending(),
        flags: MessageFlags.IsComponentsV2
    };
}

// Alternative: Return traditional components if V2 doesn't work
export function createFixedPingMessageTraditional(wsLatency: number, editLatency: number, buttonDisabled = false) {
    const message = new MessageBuilder()
        .addContainer({
            accentColor: ColorUtils.hexToInt('#5865F2'),
            children: [
                { type: 'text', content: '🤖 **Ice Bear Performance Dashboard**' },
                { type: 'text', content: '────────────────────────────────' },
                { type: 'text', content: '🚀 **Network Performance**' },
                { type: 'text', content: `🟢 **WebSocket Ping:** \`${wsLatency}ms\` • *Excellent*` },
                { type: 'text', content: `🟢 **Message Edit:** \`${editLatency}ms\` • *Excellent*` },
                { type: 'text', content: '────────────────────────────────' },
                { type: 'text', content: '⏰ **System Information**' },
                { type: 'text', content: '⚙️ **Uptime:** \`1d 2h 30m 45s\`' }
            ]
        })
        .addButton({
            customId: 'ping_refresh',
            label: 'Refresh Metrics',
            style: 'primary',
            emoji: '🔄',
            disabled: buttonDisabled
        });

    // Return traditional components
    return {
        components: message.buildForTraditionalDiscordJS()
    };
} 