export type EventItem = {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: EventItem[] = [
  {
    title: "Next.js Conf 2026",
    slug: "nextjs-conf-2026",
    location: "San Francisco, CA",
    date: "October 26, 2026",
    time: "09:00 AM",
    image: "/images/event1.png",
  },
  {
    title: "React Summit",
    slug: "react-summit-2026",
    location: "Amsterdam, Netherlands",
    date: "June 14, 2026",
    time: "10:00 AM",
    image: "/images/event2.png",
  },
  {
    title: "Google I/O",
    slug: "google-io-2026",
    location: "Mountain View, CA",
    date: "May 18, 2026",
    time: "10:00 AM",
    image: "/images/event3.png",
  },
  {
    title: "KubeCon NA",
    slug: "kubecon-na-2026",
    location: "Chicago, IL",
    date: "November 12, 2026",
    time: "08:30 AM",
    image: "/images/event4.png",
  },
  {
    title: "GitHub Universe",
    slug: "github-universe-2026",
    location: "San Francisco, CA",
    date: "November 10, 2026",
    time: "09:00 AM",
    image: "/images/event5.png",
  },
  {
    title: "AWS re:Invent",
    slug: "aws-reinvent-2026",
    location: "Las Vegas, NV",
    date: "December 1, 2026",
    time: "08:00 AM",
    image: "/images/event6.png",
  },
];
