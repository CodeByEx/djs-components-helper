import { MessageBuilder, ColorUtils } from '../src';
import { MessageFlags } from 'discord.js';

// Basic text message
const basicText = new MessageBuilder()
  .addText('Hello, Discord!')
  .addText('This is a simple text message with multiple lines.');

// Message with separator
const messageWithSeparator = new MessageBuilder()
  .addText('**Welcome to our server!**')
  .addSeparator()
  .addText('We hope you enjoy your stay!');

// Message with section and button
const messageWithSection = new MessageBuilder()
  .addSection({
    text: 'Choose your role:',
    accessory: {
      type: 'button',
      customId: 'role-select',
      label: 'Select Role',
      style: 'primary'
    }
  });

// Message with container (embed-like)
const messageWithContainer = new MessageBuilder()
  .addContainer({
    accentColor: ColorUtils.hexToInt('#0099FF'),
    children: [
      { type: 'text', content: '**Server Information**' },
      { type: 'text', content: 'Welcome to our community!' },
      { type: 'text', content: 'Members: 1,234' },
      { type: 'button', customId: 'join-btn', label: 'Join Server', style: 'success' }
    ]
  });

// Complex message with multiple components
const complexMessage = new MessageBuilder()
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
  .addButton({
    customId: 'help-btn',
    label: 'Get Help',
    style: 'secondary'
  });

// Message with select menu
const messageWithSelect = new MessageBuilder()
  .addText('**Admin Actions**')
  .addSelectMenu({
    type: 'string',
    customId: 'admin-actions',
    placeholder: 'Select an action...',
    options: [
      { label: 'Ban User', value: 'ban', description: 'Ban a user from the server' },
      { label: 'Kick User', value: 'kick', description: 'Kick a user from the server' },
      { label: 'Mute User', value: 'mute', description: 'Mute a user temporarily' }
    ]
  });

// Message with media gallery
const messageWithMedia = new MessageBuilder()
  .addText('**Server Gallery**')
  .addMediaGallery([
    { url: 'attachment://image1.png', description: 'Server banner' },
    { url: 'https://example.com/image2.jpg', description: 'Community event', spoiler: true }
  ]);

// Message with file
const messageWithFile = new MessageBuilder()
  .addText('**Important Document**')
  .addFile({
    url: 'attachment://document.pdf',
    spoiler: false
  });

// Example usage in a Discord bot
async function sendWelcomeMessage(channel: any) {
  const welcomeMessage = new MessageBuilder()
    .addText('**Welcome to our Server!**')
    .addSeparator()
    .addContainer({
      accentColor: ColorUtils.hexToInt('#0099FF'),
      children: [
        { type: 'text', content: '**Getting Started**' },
        { type: 'text', content: '1. Read the rules in #rules' },
        { type: 'text', content: '2. Choose your role below' },
        { type: 'text', content: '3. Introduce yourself in #introductions' }
      ]
    })
    .addSection({
      text: 'Ready to get started?',
      accessory: {
        type: 'button',
        customId: 'get-started',
        label: 'Get Started',
        style: 'primary'
      }
    });

  await channel.send({
    components: welcomeMessage.build(),
    flags: MessageFlags.IsComponentsV2
  });
}

// Example dashboard message
async function sendDashboard(channel: any) {
  const dashboard = new MessageBuilder()
    .addText('**Server Dashboard**')
    .addSeparator()
    .addContainer({
      accentColor: ColorUtils.hexToInt('#0099FF'),
      children: [
        { type: 'text', content: '**Statistics**' },
        { type: 'text', content: 'Members: 1,234' },
        { type: 'text', content: 'Online: 567' },
        { type: 'text', content: 'Channels: 25' }
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
      type: 'string',
      customId: 'admin-actions',
      placeholder: 'Admin actions...',
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
}

// Example error message
async function sendErrorMessage(channel: any, error: string) {
  const errorMessage = new MessageBuilder()
    .addContainer({
      accentColor: ColorUtils.hexToInt('#ED4245'),
      children: [
        { type: 'text', content: '**Error**' },
        { type: 'text', content: error }
      ]
    })
    .addButton({
      customId: 'retry',
      label: 'Retry',
      style: 'primary'
    });

  await channel.send({
    components: errorMessage.build(),
    flags: MessageFlags.IsComponentsV2
  });
}

// Example success message
async function sendSuccessMessage(channel: any, message: string) {
  const successMessage = new MessageBuilder()
    .addContainer({
      accentColor: ColorUtils.hexToInt('#57F287'),
      children: [
        { type: 'text', content: '**Success**' },
        { type: 'text', content: message }
      ]
    });

  await channel.send({
    components: successMessage.build(),
    flags: MessageFlags.IsComponentsV2
  });
}

export {
  basicText,
  messageWithSeparator,
  messageWithSection,
  messageWithContainer,
  complexMessage,
  messageWithSelect,
  messageWithMedia,
  messageWithFile,
  sendWelcomeMessage,
  sendDashboard,
  sendErrorMessage,
  sendSuccessMessage
}; 