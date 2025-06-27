import { PrismaClient } from '../../generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const timeEntries = await prisma.timeEntry.findMany({
      include: { project: true },
    });
    return NextResponse.json(timeEntries);
  } catch (error) {
    console.error("Error fetching time entries:", error);
    return NextResponse.json({ error: "Failed to fetch time entries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { startTime, endTime, duration, notes, projectId } = await request.json();
    const newTimeEntry = await prisma.timeEntry.create({
      data: {
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        duration: duration ? parseFloat(duration) : null,
        notes,
        projectId,
      },
    });
    return NextResponse.json(newTimeEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating time entry:", error);
    return NextResponse.json({ error: "Failed to create time entry" }, { status: 500 });
  }
}
