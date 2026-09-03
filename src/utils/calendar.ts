export function formatToIcsDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function generateGoogleCalendarUrl(params: {
  title: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
}): string {
  const start = formatToIcsDateTime(params.startDateTime);
  const end = formatToIcsDateTime(params.endDateTime);
  const text = encodeURIComponent(params.title);
  const details = encodeURIComponent(params.description);
  const location = encodeURIComponent(params.location);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;
}

export function downloadIcsFile(params: {
  title: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
}): void {
  const start = formatToIcsDateTime(params.startDateTime);
  const end = formatToIcsDateTime(params.endDateTime);
  const now = formatToIcsDateTime(new Date().toISOString());

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SchoolHub//School Communication Hub//TH',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:schoolhub-${Date.now()}@schoolhub.edu`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${params.title}`,
    `DESCRIPTION:${params.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${params.location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:แจ้งเตือนนัดหมายโรงเรียนล่วงหน้า 1 วัน',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${params.title.slice(0, 20)}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
