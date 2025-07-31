# Discord.js Components V2 Helper

A developer-friendly abstraction layer for Discord.js Components V2 that makes working with the new component system intuitive and enjoyable.

## Features

- 🚀 **Full V2 Support**: Every feature of Discord's Components V2 including buttons, select menus, layouts, embeds-style cards, media galleries, containers, etc.
- 🎨 **Color Utilities**: Built-in utilities for handling hex-to-Discord's internal color formats
- 🔧 **Developer-friendly**: Clean, ergonomic APIs that drastically reduce boilerplate while staying flexible
- 📦 **TypeScript-ready**: First-class type definitions for great DX in both JavaScript and TypeScript
- 🔄 **Migration Tools**: Helpers to easily migrate from classic embeds and Components V1 into V2 equivalents
- 📚 **Comprehensive Documentation**: Clear, example-driven docs with migration guides

## Installation

```bash
npm install djs-components-helper
```

## Quick Start

```typescript
import { MessageBuilder, ColorUtils } from 'djs-components-helper';
import { MessageFlags } from 'discord.js';

// Create a message with components
const message = new MessageBuilder()
  .addText('Hello, Discord!')
  .addSeparator()
  .addContainer({
    accentColor: ColorUtils.hexToInt('#0099FF'),
    children: [
      { type: 'text', content: 'This is inside a container!' },
      { type: 'button', customId: 'my-button', label: 'Click me!', style: 'primary' }
    ]
  });

// Send the message
await channel.send({
  components: message.build(),
  flags: MessageFlags.IsComponentsV2
});
```

## Core Concepts

### MessageBuilder

The main class for building complex messages with components:

```typescript
import { MessageBuilder } from 'djs-components-helper';

const message = new MessageBuilder()
  .addText('Welcome to our server!')
  .addSeparator()
  .addSection({
    text: 'Choose your role:',
    accessory: {
      type: 'button',
      customId: 'role-select',
      label: 'Select Role',
      style: 'primary'
    }
  });
```

### Color Utilities

Convert hex colors to Discord's internal format:

```typescript
import { ColorUtils } from 'djs-components-helper';

// Convert hex to Discord color
const color = ColorUtils.hexToInt('#FF0000'); // Red
const blue = ColorUtils.hexToInt('#0099FF');   // Discord Blue
const green = ColorUtils.hexToInt('#57F287');  // Discord Green
```

### Component Types

#### Text Display
```typescript
message.addText('Simple text content');
message.addText('**Bold text** with *markdown*');
```

#### Sections
```typescript
message.addSection({
  text: 'Section with button accessory',
  accessory: {
    type: 'button',
    customId: 'section-button',
    label: 'Click me!',
    style: 'primary'
  }
});
```

#### Containers
```typescript
message.addContainer({
  accentColor: ColorUtils.hexToInt('#FF0000'),
  children: [
    { type: 'text', content: 'Container content' },
    { type: 'button', customId: 'container-btn', label: 'Button', style: 'secondary' }
  ]
});
```

#### Media Galleries
```typescript
message.addMediaGallery([
  { url: 'attachment://image1.png', description: 'First image' },
  { url: 'https://example.com/image2.jpg', description: 'Second image', spoiler: true }
]);
```

#### Select Menus
```typescript
message.addSelectMenu({
  customId: 'user-select',
  placeholder: 'Select users',
  type: 'user',
  minValues: 1,
  maxValues: 5
});
```

## Migration from V1

### From Embeds to Containers

**Before (V1):**
```typescript
const embed = new EmbedBuilder()
  .setTitle('My Embed')
  .setDescription('Description')
  .setColor('#FF0000');

await channel.send({ embeds: [embed] });
```

**After (V2):**
```typescript
const message = new MessageBuilder()
  .addContainer({
    accentColor: ColorUtils.hexToInt('#FF0000'),
    children: [
      { type: 'text', content: '**My Embed**' },
      { type: 'text', content: 'Description' }
    ]
  });

await channel.send({
  components: message.build(),
  flags: MessageFlags.IsComponentsV2
});
```

### From Action Rows to Inline Components

**Before (V1):**
```typescript
const row = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('button1')
      .setLabel('Button 1')
      .setStyle(ButtonStyle.Primary)
  );

await channel.send({ components: [row] });
```

**After (V2):**
```typescript
const message = new MessageBuilder()
  .addText('Message with inline button:')
  .addButton({
    customId: 'button1',
    label: 'Button 1',
    style: 'primary'
  });

await channel.send({
  components: message.build(),
  flags: MessageFlags.IsComponentsV2
});
```

## API Reference

### MessageBuilder

#### Methods

- `addText(content: string, options?: TextOptions): MessageBuilder`
- `addSection(options: SectionOptions): MessageBuilder`
- `addContainer(options: ContainerOptions): MessageBuilder`
- `addSeparator(options?: SeparatorOptions): MessageBuilder`
- `addMediaGallery(items: MediaItem[]): MessageBuilder`
- `addFile(options: FileOptions): MessageBuilder`
- `addButton(options: ButtonOptions): MessageBuilder`
- `addSelectMenu(options: SelectMenuOptions): MessageBuilder`
- `build(): Component[]`

### ColorUtils

#### Methods

- `hexToInt(hex: string): number` - Convert hex color to Discord integer
- `intToHex(int: number): string` - Convert Discord integer to hex
- `isValidHex(hex: string): boolean` - Validate hex color format

### Component Options

#### TextOptions
```typescript
interface TextOptions {
  id?: number;
  allowedMentions?: AllowedMentions;
}
```

#### SectionOptions
```typescript
interface SectionOptions {
  text: string | string[];
  accessory?: ButtonOptions | ThumbnailOptions;
  id?: number;
}
```

#### ContainerOptions
```typescript
interface ContainerOptions {
  accentColor?: number;
  children: ComponentConfig[];
  spoiler?: boolean;
  id?: number;
}
```

## Examples

### Complex Message with Multiple Components

```typescript
const message = new MessageBuilder()
  .addText('**Welcome to our Community!**')
  .addSeparator()
  .addContainer({
    accentColor: ColorUtils.hexToInt('#57F287'),
    children: [
      { type: 'text', content: '**Getting Started**' },
      { type: 'text', content: 'Choose your role and explore our channels!' }
    ]
  })
  .addSection({
    text: 'Select your role:',
    accessory: {
      type: 'button',
      customId: 'role-select',
      label: 'Choose Role',
      style: 'primary'
    }
  })
  .addMediaGallery([
    { url: 'attachment://welcome.png', description: 'Welcome banner' }
  ]);

await channel.send({
  components: message.build(),
  files: [new AttachmentBuilder('./assets/welcome.png')],
  flags: MessageFlags.IsComponentsV2
});
```

### Interactive Dashboard

```typescript
const dashboard = new MessageBuilder()
  .addText('**Server Dashboard**')
  .addSeparator()
  .addContainer({
    accentColor: ColorUtils.hexToInt('#0099FF'),
    children: [
      { type: 'text', content: '**Statistics**' },
      { type: 'text', content: 'Members: 1,234' },
      { type: 'text', content: 'Online: 567' }
    ]
  })
  .addSection({
    text: 'Quick Actions:',
    accessory: {
      type: 'button',
      customId: 'refresh-stats',
      label: '🔄 Refresh',
      style: 'secondary'
    }
  })
  .addSelectMenu({
    customId: 'admin-actions',
    placeholder: 'Admin actions...',
    type: 'string',
    options: [
      { label: 'Ban User', value: 'ban', description: 'Ban a user from the server' },
      { label: 'Kick User', value: 'kick', description: 'Kick a user from the server' },
      { label: 'Mute User', value: 'mute', description: 'Mute a user temporarily' }
    ]
  });

await channel.send({
  components: dashboard.build(),
  flags: MessageFlags.IsComponentsV2
});
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/CodeByEx/djs-components-helper/wiki)
- 🐛 [Report Issues](https://github.com/CodeByEx/djs-components-helper/issues)
- 💬 [Discord Server](https://discord.gg/qk5NeCP6HP) 