import { MigrationUtils, ColorUtils } from '../src';
import { MessageFlags } from 'discord.js';

// Example: Converting a V1 embed to V2 container
const v1Embed = {
  title: 'Welcome to our Server!',
  description: 'We hope you enjoy your stay in our community.',
  color: '#0099FF',
  fields: [
    { name: 'Members', value: '1,234', inline: true },
    { name: 'Online', value: '567', inline: true },
    { name: 'Rules', value: 'Please read #rules before posting' }
  ],
  footer: { text: 'Server created 2024' },
  timestamp: new Date()
};

// Convert to V2
const v2Message = MigrationUtils.embedToContainer({
  title: v1Embed.title,
  description: v1Embed.description,
  color: v1Embed.color,
  fields: v1Embed.fields,
  footer: v1Embed.footer,
  timestamp: v1Embed.timestamp
});

// Example: Converting V1 action row with buttons
const v1ActionRow = {
  type: 'ACTION_ROW',
  components: [
    {
      type: 'BUTTON',
      customId: 'join-btn',
      label: 'Join Server',
      style: 1, // Primary
      disabled: false
    },
    {
      type: 'BUTTON',
      customId: 'help-btn',
      label: 'Get Help',
      style: 2, // Secondary
      disabled: false
    }
  ]
};

// Convert to V2
const v2Buttons = MigrationUtils.actionRowToInlineButtons(v1ActionRow);

// Example: Converting V1 action row with select menu
const v1SelectRow = {
  type: 'ACTION_ROW',
  components: [
    {
      type: 'STRING_SELECT',
      customId: 'role-select',
      placeholder: 'Choose your role',
      minValues: 1,
      maxValues: 1,
      options: [
        { label: 'Member', value: 'member', description: 'Regular member' },
        { label: 'Moderator', value: 'mod', description: 'Server moderator' },
        { label: 'Admin', value: 'admin', description: 'Server administrator' }
      ]
    }
  ]
};

// Convert to V2
const v2Select = MigrationUtils.actionRowToInlineSelectMenu(v1SelectRow);

// Example: Converting a complete V1 message
const v1Message = {
  content: 'Welcome to our server!',
  embeds: [
    {
      title: 'Server Information',
      description: 'This is our community server.',
      color: '#57F287',
      fields: [
        { name: 'Members', value: '1,234', inline: true },
        { name: 'Online', value: '567', inline: true }
      ]
    }
  ],
  components: [
    {
      type: 'ACTION_ROW',
      components: [
        {
          type: 'BUTTON',
          customId: 'join-btn',
          label: 'Join',
          style: 1
        }
      ]
    }
  ]
};

// Convert to V2
const v2CompleteMessage = MigrationUtils.messageV1ToV2(v1Message);

// Example: Using pre-built migration helpers
const welcomeMessage = MigrationUtils.createWelcomeMessage({
  title: 'Welcome!',
  description: 'Welcome to our amazing community!',
  color: '#0099FF',
  fields: [
    { name: 'Members', value: '1,234', inline: true },
    { name: 'Online', value: '567', inline: true }
  ],
  footer: { text: 'Thanks for joining!' }
});

const infoCard = MigrationUtils.createInfoCard({
  title: 'Server Rules',
  description: 'Please follow our community guidelines.',
  color: '#57F287',
  fields: [
    { name: 'Rule 1', value: 'Be respectful', inline: false },
    { name: 'Rule 2', value: 'No spam', inline: false },
    { name: 'Rule 3', value: 'Stay on topic', inline: false }
  ]
});

const errorCard = MigrationUtils.createErrorCard({
  description: 'Something went wrong. Please try again.',
  fields: [
    { name: 'Error Code', value: 'ERR_001', inline: true },
    { name: 'Time', value: new Date().toISOString(), inline: true }
  ]
});

const successCard = MigrationUtils.createSuccessCard({
  description: 'Operation completed successfully!',
  fields: [
    { name: 'Status', value: 'Completed', inline: true },
    { name: 'Time', value: new Date().toISOString(), inline: true }
  ]
});

const warningCard = MigrationUtils.createWarningCard({
  description: 'Please be careful with your actions.',
  fields: [
    { name: 'Warning', value: 'This action cannot be undone.', inline: false }
  ]
});

// Example: Sending migrated messages
async function sendMigratedMessages(channel: any) {
  // Send welcome message
  await channel.send({
    components: welcomeMessage.build(),
    flags: MessageFlags.IsComponentsV2
  });

  // Send info card
  await channel.send({
    components: infoCard.build(),
    flags: MessageFlags.IsComponentsV2
  });

  // Send error card
  await channel.send({
    components: errorCard.build(),
    flags: MessageFlags.IsComponentsV2
  });

  // Send success card
  await channel.send({
    components: successCard.build(),
    flags: MessageFlags.IsComponentsV2
  });

  // Send warning card
  await channel.send({
    components: warningCard.build(),
    flags: MessageFlags.IsComponentsV2
  });
}

// Example: Complex migration with custom styling
const complexV1Embed = {
  title: '🎮 Gaming Community',
  description: 'Join our gaming community and play with friends!',
  color: '#9B59B6',
  fields: [
    { name: '🎯 Games', value: 'Minecraft, Valorant, Among Us', inline: true },
    { name: '👥 Members', value: '2,500+', inline: true },
    { name: '🎉 Events', value: 'Weekly tournaments and game nights', inline: false },
    { name: '📢 Announcements', value: 'Stay updated with #announcements', inline: false }
  ],
  footer: { text: 'Gaming Community • Est. 2023' },
  timestamp: new Date()
};

const complexV2Message = MigrationUtils.embedToContainer({
  title: complexV1Embed.title,
  description: complexV1Embed.description,
  color: complexV1Embed.color,
  fields: complexV1Embed.fields,
  footer: complexV1Embed.footer,
  timestamp: complexV1Embed.timestamp
});

// Add interactive components to the migrated message
complexV2Message
  .addSeparator()
  .addSection({
    text: 'Ready to join?',
    accessory: {
      type: 'button',
      customId: 'join-gaming',
      label: '🎮 Join Gaming',
      style: 'primary'
    }
  })
  .addSelectMenu({
    type: 'string',
    customId: 'game-preference',
    placeholder: 'Select your favorite games...',
    options: [
      { label: 'Minecraft', value: 'minecraft', emoji: '⛏️' },
      { label: 'Valorant', value: 'valorant', emoji: '🎯' },
      { label: 'Among Us', value: 'among-us', emoji: '👥' },
      { label: 'Other', value: 'other', emoji: '🎮' }
    ]
  });

export {
  v2Message,
  v2Buttons,
  v2Select,
  v2CompleteMessage,
  welcomeMessage,
  infoCard,
  errorCard,
  successCard,
  warningCard,
  complexV2Message,
  sendMigratedMessages
}; 