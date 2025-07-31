# API Reference

## MessageBuilder

The main class for building Discord Components V2 messages.

### Constructor

```typescript
new MessageBuilder()
```

### Methods

#### addText(content: string, options?: TextOptions): MessageBuilder

Adds text content to the message.

```typescript
message.addText('Hello, world!');
message.addText('**Bold text** with *markdown*');
```

#### addSection(options: SectionOptions): MessageBuilder

Adds a section component with optional accessory.

```typescript
message.addSection({
  text: 'Section content',
  accessory: {
    type: 'button',
    customId: 'my-button',
    label: 'Click me!',
    style: 'primary'
  }
});
```

#### addContainer(options: ContainerOptions): MessageBuilder

Adds a container component with accent color and children.

```typescript
message.addContainer({
  accentColor: ColorUtils.hexToInt('#FF0000'),
  children: [
    { type: 'text', content: 'Container content' },
    { type: 'button', customId: 'btn', label: 'Button', style: 'secondary' }
  ]
});
```

#### addSeparator(options?: SeparatorOptions): MessageBuilder

Adds a separator component.

```typescript
message.addSeparator();
message.addSeparator({ spacing: 'medium' });
```

#### addMediaGallery(items: MediaItem[]): MessageBuilder

Adds a media gallery component.

```typescript
message.addMediaGallery([
  { url: 'attachment://image1.png', description: 'First image' },
  { url: 'https://example.com/image2.jpg', description: 'Second image', spoiler: true }
]);
```

#### addFile(options: FileOptions): MessageBuilder

Adds a file component.

```typescript
message.addFile({
  url: 'attachment://document.pdf',
  description: 'Important document'
});
```

#### addButton(options: ButtonOptions): MessageBuilder

Adds a button component.

```typescript
message.addButton({
  customId: 'my-button',
  label: 'Click me!',
  style: 'primary'
});
```

#### addSelectMenu(options: SelectMenuOptions): MessageBuilder

Adds a select menu component.

```typescript
message.addSelectMenu({
  customId: 'user-select',
  placeholder: 'Select users',
  type: 'user',
  minValues: 1,
  maxValues: 5
});
```

#### build(): Component[]

Builds and returns the final component array.

```typescript
const components = message.build();
await channel.send({
  components,
  flags: MessageFlags.IsComponentsV2
});
```

## ColorUtils

Utility class for color conversions and Discord color handling.

### Static Methods

#### hexToInt(hex: string): number

Converts a hex color string to Discord's internal integer format.

```typescript
const color = ColorUtils.hexToInt('#FF0000'); // 16711680
const blue = ColorUtils.hexToInt('#0099FF');   // 39393
```

#### intToHex(int: number): string

Converts Discord's internal integer format to hex color string.

```typescript
const hex = ColorUtils.intToHex(16711680); // '#FF0000'
```

#### hexToRgb(hex: string): [number, number, number]

Converts hex color to RGB array.

```typescript
const rgb = ColorUtils.hexToRgb('#FF0000'); // [255, 0, 0]
```

#### rgbToHex(rgb: [number, number, number]): string

Converts RGB array to hex color string.

```typescript
const hex = ColorUtils.rgbToHex([255, 0, 0]); // '#FF0000'
```

#### isValidHex(hex: string): boolean

Validates if a string is a valid hex color.

```typescript
ColorUtils.isValidHex('#FF0000'); // true
ColorUtils.isValidHex('invalid'); // false
```

#### getColorInfo(color: string | number): ColorInfo

Gets comprehensive color information.

```typescript
const info = ColorUtils.getColorInfo('#FF0000');
// { hex: '#FF0000', int: 16711680, rgb: [255, 0, 0] }
```

#### getRandomColor(): number

Returns a random Discord color.

```typescript
const color = ColorUtils.getRandomColor();
```

#### getRandomHexColor(): string

Returns a random hex color.

```typescript
const hex = ColorUtils.getRandomHexColor();
```

#### getDiscordColors(): DiscordColors

Returns Discord's standard color constants.

```typescript
const colors = ColorUtils.getDiscordColors();
// { DEFAULT: 0x000000, BLUE: 0x0099FF, GREEN: 0x57F287, ... }
```

#### isDarkColor(color: string | number): boolean

Determines if a color is dark.

```typescript
ColorUtils.isDarkColor('#000000'); // true
ColorUtils.isDarkColor('#FFFFFF'); // false
```

#### getContrastingTextColor(color: string | number): string

Returns the appropriate text color for a background.

```typescript
ColorUtils.getContrastingTextColor('#000000'); // '#FFFFFF'
ColorUtils.getContrastingTextColor('#FFFFFF'); // '#000000'
```

#### blendColors(color1: string | number, color2: string | number, ratio: number): string

Blends two colors with a specified ratio.

```typescript
const blended = ColorUtils.blendColors('#FF0000', '#0000FF', 0.5); // '#800080'
```

#### createGradient(color1: string, color2: string, steps: number): string[]

Creates a gradient between two colors.

```typescript
const gradient = ColorUtils.createGradient('#FF0000', '#0000FF', 5);
// ['#FF0000', '#BF0040', '#800080', '#4000BF', '#0000FF']
```

## MigrationUtils

Utility class for migrating from Discord.js V1 to V2 components.

### Static Methods

#### embedToContainer(embed: EmbedBuilder): ContainerConfig

Converts a Discord.js embed to a V2 container.

```typescript
const embed = new EmbedBuilder()
  .setTitle('My Embed')
  .setDescription('Description')
  .setColor('#FF0000');

const container = MigrationUtils.embedToContainer(embed);
```

#### actionRowToComponents(row: ActionRowBuilder): ComponentConfig[]

Converts an action row to V2 components.

```typescript
const row = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('button1')
      .setLabel('Button 1')
      .setStyle(ButtonStyle.Primary)
  );

const components = MigrationUtils.actionRowToComponents(row);
```

#### messageToV2(message: Message): MessageBuilder

Converts a V1 message to V2 format.

```typescript
const v2Message = MigrationUtils.messageToV2(message);
```

## Types

### TextOptions

```typescript
interface TextOptions {
  id?: number;
  allowedMentions?: AllowedMentions;
}
```

### SectionOptions

```typescript
interface SectionOptions {
  text: string | string[];
  accessory?: ButtonOptions | ThumbnailOptions;
  id?: number;
}
```

### ContainerOptions

```typescript
interface ContainerOptions {
  accentColor?: number;
  children: ComponentConfig[];
  spoiler?: boolean;
  id?: number;
}
```

### ButtonOptions

```typescript
interface ButtonOptions {
  customId: string;
  label: string;
  style: 'primary' | 'secondary' | 'success' | 'danger';
  disabled?: boolean;
  emoji?: string;
}
```

### SelectMenuOptions

```typescript
interface SelectMenuOptions {
  customId: string;
  placeholder: string;
  type: 'string' | 'user' | 'role' | 'channel' | 'mentionable';
  minValues?: number;
  maxValues?: number;
  options?: SelectMenuOption[];
  disabled?: boolean;
}
```

### MediaItem

```typescript
interface MediaItem {
  url: string;
  description?: string;
  spoiler?: boolean;
}
```

### ColorInfo

```typescript
interface ColorInfo {
  hex: string;
  int: number;
  rgb: [number, number, number];
}
```

### DiscordColors

```typescript
interface DiscordColors {
  DEFAULT: number;
  BLUE: number;
  GREEN: number;
  RED: number;
  PURPLE: number;
  YELLOW: number;
  ORANGE: number;
  PINK: number;
}
``` 