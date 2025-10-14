import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import Analysis from "@/models/Analysis";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Await params as required by Next.js 15
    const { id } = await params;

    // Find the analysis by ID and make sure it belongs to the authenticated user
    const analysis = await Analysis.findById(id).populate('userId', 'email');

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    // Check if the analysis belongs to the authenticated user
    if (analysis.userId.email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized access to this analysis" }, { status: 403 });
    }

    // Return the analysis data
    return NextResponse.json({
      success: true,
      analysis: {
        _id: analysis._id,
        title: analysis.title,
        originalTranscript: analysis.originalTranscript,
        analysis: analysis.analysis,
        status: analysis.status,
        createdAt: analysis.createdAt,
        updatedAt: analysis.updatedAt
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch analysis" },
      { status: 500 }
    );
  }
}
