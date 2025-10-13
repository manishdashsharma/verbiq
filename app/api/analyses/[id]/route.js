import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/mongodb";
import Analysis from "@/models/Analysis";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request, { params }) {
  console.log('🔍 [ANALYSIS] Fetching single analysis by ID...')

  try {
    // Check authentication
    console.log('🔐 [ANALYSIS] Checking authentication...')
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.log('❌ [ANALYSIS] No session or email found')
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('✅ [ANALYSIS] Authenticated user:', session.user.email)

    // Connect to database
    console.log('🗄️ [ANALYSIS] Connecting to database...')
    await connectDB();

    const { id } = params;
    console.log('🔎 [ANALYSIS] Searching for analysis ID:', id)

    // Find the analysis by ID and make sure it belongs to the authenticated user
    const analysis = await Analysis.findById(id).populate('userId', 'email');

    if (!analysis) {
      console.log('❌ [ANALYSIS] Analysis not found')
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    // Check if the analysis belongs to the authenticated user
    if (analysis.userId.email !== session.user.email) {
      console.log('❌ [ANALYSIS] Analysis does not belong to user')
      return NextResponse.json({ error: "Unauthorized access to this analysis" }, { status: 403 });
    }

    console.log('✅ [ANALYSIS] Analysis found and authorized')
    console.log('📋 [ANALYSIS] Analysis title:', analysis.title)
    console.log('📅 [ANALYSIS] Created at:', analysis.createdAt)

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
    console.error("❌ [ANALYSIS] Error fetching analysis:", error);
    console.error("❌ [ANALYSIS] Error stack:", error.stack);

    return NextResponse.json(
      { error: "Failed to fetch analysis" },
      { status: 500 }
    );
  }
}
