import { PrismaClient } from '../../generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { client: true },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, deadline, value, milestones, brief, attachments, status, clientId } = await request.json();
    const newProject = await prisma.project.create({
      data: {
        name,
        deadline: deadline ? new Date(deadline) : null,
        value: value ? parseFloat(value) : null,
        milestones,
        brief,
        attachments,
        status,
        clientId,
      },
    });
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
