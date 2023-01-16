const maxInt = 2147483647;
const generateId = () => {
  return (Math.floor(Math.random() * maxInt) + 1).toString();
};

export const defaultReminders = (lang) => [
  {
    id: generateId(),
    isActive: false,
    title: lang.breakFastReminderTitle,
    name: lang.reminder1,
    time: '9:00',
    days: [
      {
        id: 0,
      },
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
      {
        id: 4,
      },
      {
        id: 5,
      },
      {
        id: 6,
      },
    ],
  },
  {
    id: generateId(),
    isActive: false,
    name: lang.reminder2,
    title: lang.lunchReminderTitle,
    time: '13:00',
    days: [
      {
        id: 0,
      },
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
      {
        id: 4,
      },
      {
        id: 5,
      },
      {
        id: 6,
      },
    ],
  },
  {
    id: generateId(),
    isActive: false,
    name: lang.reminder3,
    title: lang.dinnerReminderTitle,
    time: '20:00',
    days: [
      {
        id: 0,
      },
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
      {
        id: 4,
      },
      {
        id: 5,
      },
      {
        id: 6,
      },
    ],
  },
  {
    id: generateId(),
    isActive: false,
    name: lang.reminder4,
    title: lang.snackReminderTitle,
    time: '17:00',
    days: [
      {
        id: 0,
      },
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
      {
        id: 4,
      },
      {
        id: 5,
      },
      {
        id: 6,
      },
    ],
  },
  {
    id: generateId(),
    isActive: false,
    name: lang.reminder6,
    title: lang.weightReminderTitle,
    time: '9:00',
    days: [
      {
        id: 0,
      },
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
      {
        id: 4,
      },
      {
        id: 5,
      },
      {
        id: 6,
      },
    ],
  },
  {
    id: generateId(),
    isActive: false,
    name: lang.reminder5,
    title: lang.waterReminderTitle,
    time: '9:00',
    days: [
      {
        id: 0,
      },
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
      {
        id: 4,
      },
      {
        id: 5,
      },
      {
        id: 6,
      },
    ],
  },
];
