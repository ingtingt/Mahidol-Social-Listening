import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Fetch all keywords
export async function GET() {
  try {
    const keywords = await prisma.keyword.findMany({
      orderBy: {
        createdAt: 'desc', // Show newest first
      },
    });
    return NextResponse.json(keywords);
  } catch (error) {
    console.error('Failed to fetch keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Create a new keyword
export async function POST(request: Request) {
  try {
    const { name, type } = await request.json();

    // We'll hardcode the userId to 1 (for your admin user)
    // Later, this would come from a real authentication system.
    const newKeyword = await prisma.keyword.create({
      data: {
        name,
        type,
        //userId: 1, // Assumes your admin user has id 1
      },
    });
    return NextResponse.json(newKeyword, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create keyword:', error);
    if (error.code === 'P2002') {
      // Unique constraint failed (e.g., duplicate name)
      return NextResponse.json(
        { error: 'Keyword already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create keyword' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
