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
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not found in environment variables");
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get transcript and title from request body
    const { transcript, title } = await request.json();

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    const analysisTitle = title || `Meeting Analysis - ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

    // Connect to database and check user limits
    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.analysesUsed >= user.analysesLimit) {
      return NextResponse.json(
        {
          error: "Analysis limit reached. Please upgrade your plan.",
        },
        { status: 403 }
      );
    }

    // Analyze transcript with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are VerbIQ, an AI assistant that analyzes meeting transcripts. Provide comprehensive analysis with quantitative data for visualizations in the following JSON format:

{
  "summary": "Brief 2-3 sentence summary of the meeting",
  "keyPoints": ["key point 1", "key point 2", "key point 3"],
  "actionItems": [
    {
      "task": "Description of action item",
      "assignee": "Person responsible (if mentioned)",
      "deadline": "Deadline if mentioned, or null",
      "priority": "high/medium/low",
      "category": "technical/business/administrative"
    }
  ],
  "decisions": [
    {
      "decision": "Decision made",
      "impact": "high/medium/low",
      "category": "strategic/operational/technical"
    }
  ],
  "sentiment": {
    "overall": "positive/neutral/negative",
    "score": 0.8,
    "reasoning": "Brief explanation of sentiment",
    "timeline": [
      {"time": "0-25%", "sentiment": "positive", "score": 0.7},
      {"time": "25-50%", "sentiment": "neutral", "score": 0.5},
      {"time": "50-75%", "sentiment": "positive", "score": 0.8},
      {"time": "75-100%", "sentiment": "positive", "score": 0.9}
    ]
  },
  "speakers": [
    {
      "name": "Speaker name",
      "talkTime": 45,
      "talkTimePercentage": "45%",
      "keyContributions": ["contribution 1", "contribution 2"],
      "engagementLevel": "high/medium/low",
      "topics": ["topic1", "topic2"]
    }
  ],
  "nextSteps": ["next step 1", "next step 2"],
  "risks": [
    {
      "risk": "Risk description",
      "severity": "high/medium/low",
      "likelihood": "high/medium/low",
      "mitigation": "Suggested mitigation strategy"
    }
  ],
  "opportunities": [
    {
      "opportunity": "Opportunity description",
      "impact": "high/medium/low",
      "effort": "high/medium/low",
      "timeline": "short/medium/long term"
    }
  ],
  "meetingMetrics": {
    "duration": "estimated duration in minutes",
    "participationBalance": "balanced/unbalanced",
    "topicCoverage": ["topic1", "topic2", "topic3"],
    "questionToStatementRatio": 0.3,
    "interruptionCount": 5,
    "agreementLevel": "high/medium/low"
  },
  "aiRecommendations": {
    "meetingEffectiveness": "high/medium/low",
    "improvementAreas": ["area1", "area2"],
    "strengths": ["strength1", "strength2"],
    "actionPriority": ["high priority action", "medium priority action"],
    "followUpSuggestions": ["suggestion1", "suggestion2"],
    "communicationInsights": "Overall communication quality assessment"
  },
  "topicBreakdown": [
    {"topic": "Topic name", "timeSpent": 25, "importance": "high/medium/low"},
    {"topic": "Another topic", "timeSpent": 35, "importance": "medium/low"}
  ],
  "engagementMetrics": {
    "overallEngagement": "high/medium/low",
    "mostEngagedSpeaker": "Speaker name",
    "quietParticipants": ["Speaker name"],
    "collaborationScore": 8.5
  }
}`,
        },
        {
          role: "user",
          content: `Please analyze this meeting transcript and respond with ONLY valid JSON in the exact format specified above. Do not include any markdown formatting, explanations, or text outside the JSON structure:\n\n${transcript}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 3000,
    });

    const analysisText = completion.choices[0].message.content;
    let analysis;

    try {
      // Multiple cleaning attempts for robust parsing
      let cleanedText = analysisText.trim()

      // Remove markdown code blocks
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }

      // Remove any leading/trailing non-JSON content
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        cleanedText = jsonMatch[0]
      }

      // Fix common JSON formatting issues
      cleanedText = cleanedText
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":') // Add quotes to unquoted keys

      analysis = JSON.parse(cleanedText);

      // Validate required fields and provide defaults
      analysis = {
        summary: analysis.summary || "Meeting analysis completed successfully.",
        keyPoints: Array.isArray(analysis.keyPoints) ? analysis.keyPoints : [],
        actionItems: Array.isArray(analysis.actionItems) ? analysis.actionItems : [],
        decisions: Array.isArray(analysis.decisions) ? analysis.decisions : [],
        sentiment: analysis.sentiment || { overall: "neutral", score: 0.5, reasoning: "No sentiment analysis available" },
        speakers: Array.isArray(analysis.speakers) ? analysis.speakers : [],
        nextSteps: Array.isArray(analysis.nextSteps) ? analysis.nextSteps : [],
        risks: Array.isArray(analysis.risks) ? analysis.risks : [],
        opportunities: Array.isArray(analysis.opportunities) ? analysis.opportunities : [],
        meetingMetrics: analysis.meetingMetrics || {},
        aiRecommendations: analysis.aiRecommendations || {},
        topicBreakdown: Array.isArray(analysis.topicBreakdown) ? analysis.topicBreakdown : [],
        engagementMetrics: analysis.engagementMetrics || {}
      };

    } catch (parseError) {
      // Fallback: Create a basic analysis structure with the raw content
      analysis = {
        summary: "Analysis completed. Raw response could not be parsed as structured data.",
        keyPoints: [analysisText.substring(0, 200) + "..."],
        actionItems: [],
        decisions: [],
        sentiment: { overall: "neutral", score: 0.5, reasoning: "Could not parse sentiment from response" },
        speakers: [],
        nextSteps: [],
        risks: [],
        opportunities: [],
        meetingMetrics: { duration: "Unknown", participationBalance: "unknown" },
        aiRecommendations: {
          meetingEffectiveness: "unknown",
          improvementAreas: ["Unable to parse detailed recommendations"],
          strengths: [],
          actionPriority: [],
          followUpSuggestions: [],
          communicationInsights: "Raw analysis data available in summary"
        },
        topicBreakdown: [],
        engagementMetrics: { overallEngagement: "unknown", collaborationScore: 5.0 }
      };
    }

    // Save analysis to database
    const savedAnalysis = await Analysis.create({
      userId: user._id,
      title: analysisTitle,
      originalTranscript: transcript,
      analysis: analysis,
      status: 'completed'
    });

    // Update user's analysis count
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

    // Return analysis results
    return NextResponse.json(responseData);
  } catch (error) {
    if (error.code === "insufficient_quota") {
      return NextResponse.json(
        {
          error: "OpenAI API quota exceeded. Please try again later.",
        },
        { status: 503 }
      );
    }

    // Check for OpenAI API errors
    if (error.response) {
      return NextResponse.json(
        {
          error: `OpenAI API error: ${error.response.data?.error?.message || 'Unknown API error'}`,
        },
        { status: 500 }
      );
    }

    // Check for network/connection errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      return NextResponse.json(
        {
          error: "Unable to connect to AI service. Please try again later.",
        },
        { status: 503 }
      );
    }

    // Generic error with more context
    return NextResponse.json(
      {
        error: `Failed to analyze transcript: ${error.message || 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
