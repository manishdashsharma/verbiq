import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import OpenAI from "openai";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Analysis from "@/models/Analysis";
import { authOptions } from "../auth/[...nextauth]/route";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  console.log('🚀 [ANALYZE] Starting transcript analysis...')

  try {
    // Check authentication
    console.log('🔐 [ANALYZE] Checking authentication...')
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.log('❌ [ANALYZE] No session or email found')
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('✅ [ANALYZE] Authenticated user:', session.user.email)

    // Get transcript and title from request body
    console.log('📝 [ANALYZE] Parsing request body...')
    const { transcript, title } = await request.json();

    if (!transcript || transcript.trim().length === 0) {
      console.log('❌ [ANALYZE] No transcript provided')
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    const analysisTitle = title || `Meeting Analysis - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
    console.log('📄 [ANALYZE] Analysis title:', analysisTitle)
    console.log('📏 [ANALYZE] Transcript length:', transcript.length, 'characters')

    // Connect to database and check user limits
    console.log('🗄️ [ANALYZE] Connecting to database...')
    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    console.log('👤 [ANALYZE] User found:', user ? `ID: ${user._id}, Used: ${user.analysesUsed}/${user.analysesLimit}` : 'null')

    if (!user) {
      console.log('❌ [ANALYZE] User not found in database')
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.analysesUsed >= user.analysesLimit) {
      console.log('⚠️ [ANALYZE] User has reached analysis limit:', user.analysesUsed, '/', user.analysesLimit)
      return NextResponse.json(
        {
          error: "Analysis limit reached. Please upgrade your plan.",
        },
        { status: 403 }
      );
    }

    // Analyze transcript with OpenAI
    console.log('🤖 [ANALYZE] Calling OpenAI API...')
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are VerbIQ, an AI assistant that analyzes meeting transcripts. Provide comprehensive analysis in the following JSON format:

{
  "summary": "Brief 2-3 sentence summary of the meeting",
  "keyPoints": ["key point 1", "key point 2", "key point 3"],
  "actionItems": [
    {
      "task": "Description of action item",
      "assignee": "Person responsible (if mentioned)",
      "deadline": "Deadline if mentioned, or null"
    }
  ],
  "decisions": ["decision 1", "decision 2"],
  "sentiment": {
    "overall": "positive/neutral/negative",
    "score": 0.8,
    "reasoning": "Brief explanation of sentiment"
  },
  "speakers": [
    {
      "name": "Speaker name",
      "talkTime": "estimated percentage",
      "keyContributions": ["contribution 1", "contribution 2"]
    }
  ],
  "nextSteps": ["next step 1", "next step 2"],
  "risks": ["risk or concern 1", "risk or concern 2"],
  "opportunities": ["opportunity 1", "opportunity 2"]
}`,
        },
        {
          role: "user",
          content: `Please analyze this meeting transcript:\n\n${transcript}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    console.log('✅ [ANALYZE] OpenAI API response received')
    const analysisText = completion.choices[0].message.content;
    console.log('📊 [ANALYZE] Raw analysis text length:', analysisText.length)

    let analysis;

    try {
      // Log the raw response for debugging
      console.log('🔍 [ANALYZE] Raw OpenAI response (first 500 chars):', analysisText.substring(0, 500))
      console.log('🔍 [ANALYZE] Response starts with:', analysisText.substring(0, 50))
      console.log('🔍 [ANALYZE] Response ends with:', analysisText.substring(-50))

      // Try to clean the response if it has markdown formatting
      let cleanedText = analysisText.trim()
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        console.log('🧹 [ANALYZE] Cleaned markdown formatting')
      }
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '')
        console.log('🧹 [ANALYZE] Cleaned code block formatting')
      }

      analysis = JSON.parse(cleanedText);
      console.log('✅ [ANALYZE] Successfully parsed JSON response')
      console.log('📋 [ANALYZE] Analysis summary:', analysis.summary?.substring(0, 100) + '...')
    } catch (parseError) {
      console.error("❌ [ANALYZE] Failed to parse OpenAI response:", parseError);
      console.error("❌ [ANALYZE] Raw response length:", analysisText.length);
      console.error("❌ [ANALYZE] Raw response (first 1000 chars):", analysisText.substring(0, 1000));
      console.error("❌ [ANALYZE] Raw response (last 200 chars):", analysisText.substring(-200));

      return NextResponse.json(
        {
          error: "Failed to parse analysis results. OpenAI returned invalid JSON format.",
        },
        { status: 500 }
      );
    }

    // Save analysis to database
    console.log('💾 [ANALYZE] Saving analysis to database...')
    const savedAnalysis = await Analysis.create({
      userId: user._id,
      title: analysisTitle,
      originalTranscript: transcript,
      analysis: analysis,
      status: 'completed'
    });

    console.log('✅ [ANALYZE] Analysis saved with ID:', savedAnalysis._id.toString())

    // Update user's analysis count
    console.log('📈 [ANALYZE] Updating user analysis count from', user.analysesUsed, 'to', user.analysesUsed + 1)
    user.analysesUsed += 1;
    await user.save();

    const responseData = {
      success: true,
      analysisId: savedAnalysis._id,
      analysis,
      usage: {
        used: user.analysesUsed,
        limit: user.analysesLimit,
        remaining: user.analysesLimit - user.analysesUsed,
      },
    };

    console.log('🎉 [ANALYZE] Analysis completed successfully!')
    console.log('📊 [ANALYZE] Final usage:', responseData.usage)

    // Return analysis results
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("❌ [ANALYZE] Analysis error:", error);
    console.error("❌ [ANALYZE] Error stack:", error.stack);

    if (error.code === "insufficient_quota") {
      console.log("⚠️ [ANALYZE] OpenAI quota exceeded");
      return NextResponse.json(
        {
          error: "OpenAI API quota exceeded. Please try again later.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to analyze transcript",
      },
      { status: 500 }
    );
  }
}
