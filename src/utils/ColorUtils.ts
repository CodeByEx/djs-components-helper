import type { ColorConversion } from '../types';

/**
 * Utility class for handling color conversions and Discord color operations
 */
export class ColorUtils {
  // Common Discord colors
  static readonly COLORS = {
    DEFAULT: 0x000000,
    AQUA: 0x1ABC9C,
    GREEN: 0x57F287,
    BLUE: 0x0099FF,
    PURPLE: 0x9B59B6,
    LUMINOUS_VIVID_PINK: 0xE91E63,
    GOLD: 0xF1C40F,
    ORANGE: 0xE67E22,
    RED: 0xED4245,
    GREY: 0x95A5A6,
    NAVY: 0x34495E,
    DARK_AQUA: 0x11806A,
    DARK_GREEN: 0x1F8B4C,
    DARK_BLUE: 0x206694,
    DARK_PURPLE: 0x71368A,
    DARK_VIVID_PINK: 0xAD1457,
    DARK_GOLD: 0xC27C0E,
    DARK_ORANGE: 0xA84300,
    DARK_RED: 0x992D22,
    DARK_GREY: 0x979C9F,
    DARKER_GREY: 0x7F8C8D,
    LIGHT_GREY: 0xBCC0C0,
    DARK_NAVY: 0x2C3E50,
    BLURPLE: 0x7289DA,
    GREYPLE: 0x99AAB5,
    DARK_BUT_NOT_BLACK: 0x2C2F33,
    NOT_QUITE_BLACK: 0x23272A,
  } as const;

  /**
   * Convert hex color string to Discord integer format
   * @param hex - Hex color string (with or without #)
   * @returns Discord color integer
   */
  static hexToInt(hex: string): number {
    if (!this.isValidHex(hex)) {
      throw new Error(`Invalid hex color: ${hex}`);
    }

    // Remove # if present
    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    
    // Parse hex to integer
    return parseInt(cleanHex, 16);
  }

  /**
   * Convert Discord integer color to hex string
   * @param int - Discord color integer
   * @returns Hex color string with #
   */
  static intToHex(int: number): string {
    if (int < 0 || int > 0xFFFFFF) {
      throw new Error(`Invalid color integer: ${int}. Must be between 0 and 16777215`);
    }

    return `#${int.toString(16).padStart(6, '0').toUpperCase()}`;
  }

  /**
   * Convert hex color to RGB array
   * @param hex - Hex color string
   * @returns RGB array [r, g, b]
   */
  static hexToRgb(hex: string): [number, number, number] {
    const int = this.hexToInt(hex);
    return [
      (int >> 16) & 255,
      (int >> 8) & 255,
      int & 255
    ];
  }

  /**
   * Convert RGB array to hex color
   * @param rgb - RGB array [r, g, b]
   * @returns Hex color string with #
   */
  static rgbToHex(rgb: [number, number, number]): string {
    const [r, g, b] = rgb;
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw new Error(`Invalid RGB values: [${r}, ${g}, ${b}]. Must be between 0 and 255`);
    }

    const int = (r << 16) | (g << 8) | b;
    return this.intToHex(int);
  }

  /**
   * Validate hex color format
   * @param hex - Hex color string to validate
   * @returns True if valid hex color
   */
  static isValidHex(hex: string): boolean {
    const hexRegex = /^#?[A-Fa-f0-9]{6}$/;
    return hexRegex.test(hex);
  }

  /**
   * Get color information including hex, int, and RGB values
   * @param color - Hex string or integer
   * @returns ColorConversion object with all formats
   */
  static getColorInfo(color: string | number): ColorConversion {
    let hex: string;
    let int: number;

    if (typeof color === 'string') {
      hex = color.startsWith('#') ? color : `#${color}`;
      int = this.hexToInt(hex);
    } else {
      int = color;
      hex = this.intToHex(int);
    }

    return {
      hex,
      int,
      rgb: this.hexToRgb(hex)
    };
  }

  /**
   * Get a random Discord color
   * @returns Random color integer
   */
  static getRandomColor(): number {
    const colors = Object.values(this.COLORS);
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Get a random hex color
   * @returns Random hex color string
   */
  static getRandomHexColor(): string {
    return this.intToHex(this.getRandomColor());
  }

  /**
   * Get predefined Discord colors
   * @returns Object with all Discord color constants
   */
  static getDiscordColors(): typeof this.COLORS {
    return this.COLORS;
  }

  /**
   * Check if a color is dark (useful for determining text color)
   * @param color - Hex string or integer
   * @returns True if color is considered dark
   */
  static isDarkColor(color: string | number): boolean {
    const info = this.getColorInfo(color);
    const [r, g, b] = info.rgb;
    
    // Calculate luminance using standard formula
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance < 128;
  }

  /**
   * Get contrasting text color (black or white) for a background color
   * @param backgroundColor - Background color (hex or int)
   * @returns Hex color string for contrasting text
   */
  static getContrastingTextColor(backgroundColor: string | number): string {
    return this.isDarkColor(backgroundColor) ? '#FFFFFF' : '#000000';
  }

  /**
   * Blend two colors together
   * @param color1 - First color (hex or int)
   * @param color2 - Second color (hex or int)
   * @param ratio - Blend ratio (0-1, where 0 is all color1, 1 is all color2)
   * @returns Blended hex color
   */
  static blendColors(color1: string | number, color2: string | number, ratio: number): string {
    if (ratio < 0 || ratio > 1) {
      throw new Error('Ratio must be between 0 and 1');
    }

    const info1 = this.getColorInfo(color1);
    const info2 = this.getColorInfo(color2);
    
    const [r1, g1, b1] = info1.rgb;
    const [r2, g2, b2] = info2.rgb;

    const blendedRgb: [number, number, number] = [
      Math.round(r1 * (1 - ratio) + r2 * ratio),
      Math.round(g1 * (1 - ratio) + g2 * ratio),
      Math.round(b1 * (1 - ratio) + b2 * ratio)
    ];

    return this.rgbToHex(blendedRgb);
  }

  /**
   * Create a gradient between two colors
   * @param color1 - Start color (hex or int)
   * @param color2 - End color (hex or int)
   * @param steps - Number of steps in gradient
   * @returns Array of hex colors
   */
  static createGradient(color1: string | number, color2: string | number, steps: number): string[] {
    if (steps < 2) {
      throw new Error('Steps must be at least 2');
    }

    const colors: string[] = [];
    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      colors.push(this.blendColors(color1, color2, ratio));
    }

    return colors;
  }
} 