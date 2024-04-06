import { Button } from '@radix-ui/themes';
import React from 'react';

interface GoogleCalendarICSProps {
  event: {
    summary: string;
    description: string;
    start: Date;
    end: Date;
    location?: string;
  };
}

const GoogleCalendarICS: React.FC<GoogleCalendarICSProps> = ({ event }) => {
  const handleDownloadICS = () => {
    const icsContent = generateICSContent(event);
    downloadICSFile(icsContent, event.summary);
  };

  const generateICSContent = (event: GoogleCalendarICSProps['event']) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Google Inc//Google Calendar 70.9054//EN',
      'BEGIN:VEVENT',
      `DTSTART:${formatDateForICS(event.start)}`,
      `DTEND:${formatDateForICS(event.end)}`,
      `SUMMARY:${event.summary}`,
      `DESCRIPTION:${event.description}`,
      event.location ? `LOCATION:${event.location}` : '',
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean).join('\n');

    return icsContent;
  };

  const formatDateForICS = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  };

  const downloadICSFile = (icsContent: string, filename: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`);
    element.setAttribute('download', `${filename}.ics`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Button onClick={handleDownloadICS}>
      Add to Google Calendar
    </Button>
  );
};

export default GoogleCalendarICS;