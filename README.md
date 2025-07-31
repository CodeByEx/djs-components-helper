# Discord.js Components V2 Helper

A developer-friendly abstraction layer for Discord.js Components V2 that provides an intuitive API for creating rich, interactive messages.

## 🚀 Features

- **Simple API**: Easy-to-use builder pattern for creating V2 components
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Flexible**: Support for both V2 components and traditional Discord.js components
- **Validation**: Built-in validation to prevent common errors
- **Migration Tools**: Utilities to help migrate from embeds to V2 components

## 📦 Installation

```bash
npm install djs-components-helper
```

## 🔧 Quick Start

### Basic Usage

```typescript
import { MessageBuilder, ColorUtils } from 'djs-components-helper';
import { MessageFlags } from 'discord.js';

// Create a simple message with V2 components
const message = new MessageBuilder()
    .addContainer({
        accentColor: ColorUtils.hexToInt('#5865F2'),
        children: [
            { type: 'text', content: '🤖 **Bot Status Dashboard**' },
            { type: 'text', content: '────────────────────────────────' },
            { type: 'text', content: '🟢 **Online** - All systems operational' }
        ]
    })
    .addButton({
        customId: 'refresh_status',
        label: 'Refresh Status',
        style: 'primary',
        emoji: '🔄'
    });

// Send with V2 components (RECOMMENDED)
await channel.send({
    components: message.buildForV2MessageSending(),
    flags: MessageFlags.IsComponentsV2
});

// Or use traditional components as fallback
await channel.send({
    components: message.buildForTraditionalDiscordJS()
});
```

### Advanced Usage

```typescript
const dashboard = new MessageBuilder()
    .addContainer({
        accentColor: ColorUtils.hexToInt('#2ECC71'),
        children: [
            { type: 'text', content: '📊 **Performance Metrics**' },
            { type: 'text', content: 'Real-time system monitoring' }
        ]
    })
    .addSeparator()
    .addSection({
        text: [
            '🖥️ **CPU Usage:** 45%',
            '💾 **Memory:** 2.1GB / 8GB',
            '🌐 **Network:** 150ms ping'
        ],
        accessory: {
            type: 'button',
            customId: 'view_details',
            label: 'View Details',
            style: 'secondary'
        }
    })
    .addButton({
        customId: 'export_report',
        label: 'Export Report',
        style: 'success',
        emoji: '📊'
    });

// Build for different use cases
const v2Components = dashboard.buildForV2MessageSending();
const traditionalComponents = dashboard.buildForTraditionalDiscordJS();
const messagePayload = dashboard.buildMessagePayload('System Status Update');
```

## 🔧 API Reference

### MessageBuilder

The main builder class for creating V2 components.

#### Methods

- `addText(content, options?)` - Add text display component
- `addContainer(options)` - Add container with accent color and children
- `addSection(options)` - Add section with text and optional accessory
- `addSeparator(options?)` - Add visual separator
- `addButton(options)` - Add interactive button
- `addSelectMenu(options)` - Add select menu component

#### Build Methods

- `buildForV2MessageSending()` - Returns V2 components for use with `MessageFlags.IsComponentsV2`
- `buildForTraditionalDiscordJS()` - Converts V2 components to traditional Discord.js components
- `buildMessagePayload(content?)` - Returns complete message payload with content and components

### ColorUtils

Utility functions for color conversion.

- `hexToInt(hex)` - Convert hex color to integer
- `intToHex(int)` - Convert integer to hex color

## 🛠️ Migration from Embeds

The package includes utilities to help migrate from traditional embeds to V2 components:

```typescript
import { MigrationUtils } from 'djs-components-helper';

// Convert embed to V2 components
const v2Components = MigrationUtils.embedToV2Components(embed);
```

## ⚠️ Important Notes

### V2 Components vs Traditional Components

This package supports both V2 components and traditional Discord.js components:

1. **V2 Components** (Recommended): Use `buildForV2MessageSending()` with `MessageFlags.IsComponentsV2`
2. **Traditional Components** (Fallback): Use `buildForTraditionalDiscordJS()` for compatibility

### MessageFlags.IsComponentsV2

The `MessageFlags.IsComponentsV2` flag is required for V2 components to display correctly. If this flag is not available in your Discord.js version, use the traditional component methods.

## 🐛 Troubleshooting

### "Cannot send an empty message" Error

This error occurs when the package tries to convert V2 components incorrectly. Use the correct build method:

```typescript
// ❌ Wrong - causes empty message error
const components = message.buildForDiscordJS();

// ✅ Correct - use V2 components
const components = message.buildForV2MessageSending();

// ✅ Correct - use traditional components
const components = message.buildForTraditionalDiscordJS();
```

### Type Errors

If you encounter type errors, ensure you're using the correct method for your use case:

```typescript
// For V2 components
const v2Components = message.buildForV2MessageSending();

// For traditional Discord.js components
const traditionalComponents = message.buildForTraditionalDiscordJS();
```

## 📝 Examples

See the `examples/` directory for comprehensive usage examples:

- `basic-usage.ts` - Basic component creation
- `migration-examples.ts` - Migration from embeds
- `fixed-bot-usage.ts` - Fixed bot implementation examples

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 