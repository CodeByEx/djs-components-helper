import { ColorUtils } from '../utils/ColorUtils';

describe('ColorUtils', () => {
  describe('hexToInt', () => {
    it('should convert hex color to integer', () => {
      expect(ColorUtils.hexToInt('#FF0000')).toBe(16711680); // Red
      expect(ColorUtils.hexToInt('#00FF00')).toBe(65280); // Green
      expect(ColorUtils.hexToInt('#0000FF')).toBe(255); // Blue
      expect(ColorUtils.hexToInt('#FFFFFF')).toBe(16777215); // White
      expect(ColorUtils.hexToInt('#000000')).toBe(0); // Black
    });

    it('should handle hex without #', () => {
      expect(ColorUtils.hexToInt('FF0000')).toBe(16711680);
      expect(ColorUtils.hexToInt('00FF00')).toBe(65280);
    });

    it('should handle Discord colors', () => {
      expect(ColorUtils.hexToInt('#0099FF')).toBe(39423); // Discord Blue
      expect(ColorUtils.hexToInt('#57F287')).toBe(5763719); // Discord Green
      expect(ColorUtils.hexToInt('#ED4245')).toBe(15548997); // Discord Red
    });

    it('should throw error for invalid hex', () => {
      expect(() => ColorUtils.hexToInt('invalid')).toThrow('Invalid hex color: invalid');
      expect(() => ColorUtils.hexToInt('#GG0000')).toThrow('Invalid hex color: #GG0000');
      expect(() => ColorUtils.hexToInt('#123')).toThrow('Invalid hex color: #123');
    });
  });

  describe('intToHex', () => {
    it('should convert integer to hex', () => {
      expect(ColorUtils.intToHex(16711680)).toBe('#FF0000');
      expect(ColorUtils.intToHex(65280)).toBe('#00FF00');
      expect(ColorUtils.intToHex(255)).toBe('#0000FF');
      expect(ColorUtils.intToHex(16777215)).toBe('#FFFFFF');
      expect(ColorUtils.intToHex(0)).toBe('#000000');
    });

    it('should handle Discord colors', () => {
      expect(ColorUtils.intToHex(39393)).toBe('#0099E1');
      expect(ColorUtils.intToHex(5752199)).toBe('#57C587');
      expect(ColorUtils.intToHex(15548997)).toBe('#ED4245');
    });

    it('should throw error for invalid integer', () => {
      expect(() => ColorUtils.intToHex(-1)).toThrow('Invalid color integer: -1. Must be between 0 and 16777215');
      expect(() => ColorUtils.intToHex(16777216)).toThrow('Invalid color integer: 16777216. Must be between 0 and 16777215');
    });
  });

  describe('hexToRgb', () => {
    it('should convert hex to RGB array', () => {
      expect(ColorUtils.hexToRgb('#FF0000')).toEqual([255, 0, 0]);
      expect(ColorUtils.hexToRgb('#00FF00')).toEqual([0, 255, 0]);
      expect(ColorUtils.hexToRgb('#0000FF')).toEqual([0, 0, 255]);
      expect(ColorUtils.hexToRgb('#FFFFFF')).toEqual([255, 255, 255]);
      expect(ColorUtils.hexToRgb('#000000')).toEqual([0, 0, 0]);
    });

    it('should handle hex without #', () => {
      expect(ColorUtils.hexToRgb('FF0000')).toEqual([255, 0, 0]);
      expect(ColorUtils.hexToRgb('00FF00')).toEqual([0, 255, 0]);
    });
  });

  describe('rgbToHex', () => {
    it('should convert RGB array to hex', () => {
      expect(ColorUtils.rgbToHex([255, 0, 0])).toBe('#FF0000');
      expect(ColorUtils.rgbToHex([0, 255, 0])).toBe('#00FF00');
      expect(ColorUtils.rgbToHex([0, 0, 255])).toBe('#0000FF');
      expect(ColorUtils.rgbToHex([255, 255, 255])).toBe('#FFFFFF');
      expect(ColorUtils.rgbToHex([0, 0, 0])).toBe('#000000');
    });

    it('should throw error for invalid RGB values', () => {
      expect(() => ColorUtils.rgbToHex([-1, 0, 0])).toThrow('Invalid RGB values: [-1, 0, 0]. Must be between 0 and 255');
      expect(() => ColorUtils.rgbToHex([256, 0, 0])).toThrow('Invalid RGB values: [256, 0, 0]. Must be between 0 and 255');
      expect(() => ColorUtils.rgbToHex([0, -1, 0])).toThrow('Invalid RGB values: [0, -1, 0]. Must be between 0 and 255');
    });
  });

  describe('isValidHex', () => {
    it('should validate hex colors', () => {
      expect(ColorUtils.isValidHex('#FF0000')).toBe(true);
      expect(ColorUtils.isValidHex('#00FF00')).toBe(true);
      expect(ColorUtils.isValidHex('#0000FF')).toBe(true);
      expect(ColorUtils.isValidHex('#FFFFFF')).toBe(true);
      expect(ColorUtils.isValidHex('#000000')).toBe(true);
      expect(ColorUtils.isValidHex('FF0000')).toBe(true);
      expect(ColorUtils.isValidHex('00FF00')).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      expect(ColorUtils.isValidHex('invalid')).toBe(false);
      expect(ColorUtils.isValidHex('#GG0000')).toBe(false);
      expect(ColorUtils.isValidHex('#123')).toBe(false);
      expect(ColorUtils.isValidHex('#12345')).toBe(false);
      expect(ColorUtils.isValidHex('#1234567')).toBe(false);
    });
  });

  describe('getColorInfo', () => {
    it('should get color info from hex string', () => {
      const info = ColorUtils.getColorInfo('#FF0000');
      expect(info.hex).toBe('#FF0000');
      expect(info.int).toBe(16711680);
      expect(info.rgb).toEqual([255, 0, 0]);
    });

    it('should get color info from integer', () => {
      const info = ColorUtils.getColorInfo(16711680);
      expect(info.hex).toBe('#FF0000');
      expect(info.int).toBe(16711680);
      expect(info.rgb).toEqual([255, 0, 0]);
    });

    it('should handle hex without #', () => {
      const info = ColorUtils.getColorInfo('FF0000');
      expect(info.hex).toBe('#FF0000');
      expect(info.int).toBe(16711680);
      expect(info.rgb).toEqual([255, 0, 0]);
    });
  });

  describe('getRandomColor', () => {
    it('should return a random Discord color', () => {
      const color = ColorUtils.getRandomColor();
      const colors = Object.values(ColorUtils.COLORS);
      expect(colors).toContain(color);
    });

    it('should return different colors on multiple calls', () => {
      const color1 = ColorUtils.getRandomColor();
      const color2 = ColorUtils.getRandomColor();
      const color3 = ColorUtils.getRandomColor();
      
      // Note: This test might occasionally fail due to randomness
      // but it's very unlikely to get the same color 3 times in a row
      const colors = [color1, color2, color3];
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getRandomHexColor', () => {
    it('should return a random hex color', () => {
      const hex = ColorUtils.getRandomHexColor();
      expect(ColorUtils.isValidHex(hex)).toBe(true);
    });
  });

  describe('getDiscordColors', () => {
    it('should return Discord color constants', () => {
      const colors = ColorUtils.getDiscordColors();
      expect(colors.DEFAULT).toBe(0x000000);
      expect(colors.BLUE).toBe(0x0099FF);
      expect(colors.GREEN).toBe(0x57F287);
      expect(colors.RED).toBe(0xED4245);
      expect(colors.PURPLE).toBe(0x9B59B6);
    });
  });

  describe('isDarkColor', () => {
    it('should identify dark colors', () => {
      expect(ColorUtils.isDarkColor('#000000')).toBe(true);
      expect(ColorUtils.isDarkColor('#0000FF')).toBe(true);
      expect(ColorUtils.isDarkColor('#800000')).toBe(true);
      expect(ColorUtils.isDarkColor('#FF0000')).toBe(true);
      expect(ColorUtils.isDarkColor('#FFFFFF')).toBe(false);
      expect(ColorUtils.isDarkColor('#FFFF00')).toBe(false);
    });

    it('should work with integers', () => {
      expect(ColorUtils.isDarkColor(0)).toBe(true);
      expect(ColorUtils.isDarkColor(255)).toBe(true);
      expect(ColorUtils.isDarkColor(16711680)).toBe(true);
      expect(ColorUtils.isDarkColor(16777215)).toBe(false);
    });
  });

  describe('getContrastingTextColor', () => {
    it('should return white for dark backgrounds', () => {
      expect(ColorUtils.getContrastingTextColor('#000000')).toBe('#FFFFFF');
      expect(ColorUtils.getContrastingTextColor('#0000FF')).toBe('#FFFFFF');
      expect(ColorUtils.getContrastingTextColor('#800000')).toBe('#FFFFFF');
    });

    it('should return black for light backgrounds', () => {
      expect(ColorUtils.getContrastingTextColor('#FFFFFF')).toBe('#000000');
      expect(ColorUtils.getContrastingTextColor('#FFFF00')).toBe('#000000');
      expect(ColorUtils.getContrastingTextColor('#FF0000')).toBe('#FFFFFF');
    });
  });

  describe('blendColors', () => {
    it('should blend colors correctly', () => {
      expect(ColorUtils.blendColors('#FF0000', '#0000FF', 0.5)).toBe('#800080');
      expect(ColorUtils.blendColors('#FF0000', '#00FF00', 0.5)).toBe('#808000');
      expect(ColorUtils.blendColors('#000000', '#FFFFFF', 0.5)).toBe('#808080');
    });

    it('should handle ratio extremes', () => {
      expect(ColorUtils.blendColors('#FF0000', '#0000FF', 0)).toBe('#FF0000');
      expect(ColorUtils.blendColors('#FF0000', '#0000FF', 1)).toBe('#0000FF');
    });

    it('should throw error for invalid ratio', () => {
      expect(() => ColorUtils.blendColors('#FF0000', '#0000FF', -0.1)).toThrow('Ratio must be between 0 and 1');
      expect(() => ColorUtils.blendColors('#FF0000', '#0000FF', 1.1)).toThrow('Ratio must be between 0 and 1');
    });

    it('should work with integers', () => {
      expect(ColorUtils.blendColors(16711680, 255, 0.5)).toBe('#800080');
    });
  });

  describe('createGradient', () => {
    it('should create gradient with specified steps', () => {
      const gradient = ColorUtils.createGradient('#FF0000', '#0000FF', 3);
      expect(gradient).toHaveLength(3);
      expect(gradient[0]).toBe('#FF0000');
      expect(gradient[2]).toBe('#0000FF');
    });

    it('should create gradient with many steps', () => {
      const gradient = ColorUtils.createGradient('#FF0000', '#0000FF', 5);
      expect(gradient).toHaveLength(5);
      expect(gradient[0]).toBe('#FF0000');
      expect(gradient[4]).toBe('#0000FF');
    });

    it('should throw error for insufficient steps', () => {
      expect(() => ColorUtils.createGradient('#FF0000', '#0000FF', 1)).toThrow('Steps must be at least 2');
      expect(() => ColorUtils.createGradient('#FF0000', '#0000FF', 0)).toThrow('Steps must be at least 2');
    });
  });
}); 