import { getProjectRequestById, updateProjectRequestQualification, updateProjectRequestFollowUp } from '@/lib/db';

/**
 * POST /api/triage
 *
 * Analyzes a project request and generates:
 * - Qualification status recommendation
 * - Triage summary (client objective, requested service, business type, etc.)
 * - Missing information
 * - Technical complexity assessment
 * - Business value assessment
 * - Delivery risk assessment
 * - Recommended discovery questions
 * - Recommended next action
 * - Follow-up draft for missing information
 *
 * OpenClaw recommends — owner reviews and approves.
 */

const QUALIFICATION_STATUSES = [
  'NEW', 'NEEDS REVIEW', 'NEEDS CLIENT INFORMATION', 'QUALIFIED',
  'PROPOSAL READY', 'PROPOSAL SENT', 'AWAITING DECISION', 'APPROVED',
  'NOT A FIT', 'ARCHIVED',
];

function generateTriage(request) {
  if (!request) return null;

  const name = request.name || 'Unknown';
  const email = request.email || 'Unknown';
  const company = request.company || '';
  const projectName = request.project_name || 'Untitled';
  const projectType = request.project_type || '';
  const description = request.description || '';
  const desiredOutcome = request.desired_outcome || '';
  const currentWebsite = request.current_website || '';
  const timeline = request.timeline || '';
  const budgetRange = request.budget_range || '';
  const referralSource = request.referral_source || '';
  const additionalInfo = request.additional_info || '';

  // Determine missing information
  const missingInfo = [];
  if (!company) missingInfo.push('Business/company name');
  if (!projectType) missingInfo.push('Project type');
  if (!currentWebsite) missingInfo.push('Current website or platform');
  if (!desiredOutcome) missingInfo.push('Desired outcome');
  if (!timeline) missingInfo.push('Timeline');
  if (!budgetRange) missingInfo.push('Budget range');
  if (!additionalInfo) missingInfo.push('Additional context or requirements');

  // Determine client objective from description
  let clientObjective = 'Build or improve a digital presence';
  if (description.toLowerCase().includes('lead') || description.toLowerCase().includes('customer')) {
    clientObjective = 'Generate more leads and customers';
  } else if (description.toLowerCase().includes('sell') || description.toLowerCase().includes('order') || description.toLowerCase().includes('ecom')) {
    clientObjective = 'Sell products or services online';
  } else if (description.toLowerCase().includes('automate') || description.toLowerCase().includes('workflow')) {
    clientObjective = 'Automate business operations';
  } else if (description.toLowerCase().includes('dashboard') || description.toLowerCase().includes('admin')) {
    clientObjective = 'Manage business operations through a dashboard';
  } else if (description.toLowerCase().includes('redesign') || description.toLowerCase().includes('refresh')) {
    clientObjective = 'Redesign or refresh an existing site';
  }

  // Determine business type
  let businessType = 'Small business';
  if (description.toLowerCase().includes('restaurant') || description.toLowerCase().includes('food') || description.toLowerCase().includes('cafe')) {
    businessType = 'Food & beverage';
  } else if (description.toLowerCase().includes('nonprofit') || description.toLowerCase().includes('non-profit') || description.toLowerCase().includes('charity')) {
    businessType = 'Nonprofit';
  } else if (description.toLowerCase().includes('ecommerce') || description.toLowerCase().includes('shop') || description.toLowerCase().includes('store')) {
    businessType = 'E-commerce / Retail';
  } else if (description.toLowerCase().includes('service') || description.toLowerCase().includes('consult')) {
    businessType = 'Service provider';
  } else if (description.toLowerCase().includes('creator') || description.toLowerCase().includes('artist') || description.toLowerCase().includes('musician')) {
    businessType = 'Creator / Artist';
  } else if (description.toLowerCase().includes('health') || description.toLowerCase().includes('fitness') || description.toLowerCase().includes('wellness')) {
    businessType = 'Health & wellness';
  }

  // Technical complexity
  let technicalComplexity = 'Low';
  const complexityKeywords = ['api', 'integration', 'database', 'custom', 'complex', 'multi', 'platform', 'mobile', 'app'];
  const complexityScore = complexityKeywords.filter(k => description.toLowerCase().includes(k)).length;
  if (complexityScore >= 3) technicalComplexity = 'High';
  else if (complexityScore >= 1) technicalComplexity = 'Medium';

  // Business value assessment
  let businessValue = 'Standard';
  if (budgetRange === '10000-plus' || budgetRange === '5000-10000') {
    businessValue = 'High';
  } else if (budgetRange === 'under-2500') {
    businessValue = 'Entry';
  }

  // Delivery risk
  let deliveryRisk = 'Low';
  if (technicalComplexity === 'High' && (!timeline || timeline === 'asap')) {
    deliveryRisk = 'High';
  } else if (technicalComplexity === 'High' || !timeline) {
    deliveryRisk = 'Medium';
  }

  // Recommended discovery questions
  const discoveryQuestions = [];
  if (!desiredOutcome) {
    discoveryQuestions.push('What specific business problem are you trying to solve?');
  }
  if (!currentWebsite) {
    discoveryQuestions.push('Do you have an existing website or online presence?');
  }
  if (!budgetRange) {
    discoveryQuestions.push('What is your budget range for this project?');
  }
  if (!timeline) {
    discoveryQuestions.push('What is your target timeline?');
  }
  if (technicalComplexity === 'High') {
    discoveryQuestions.push('Do you have technical specifications or requirements documents?');
  }
  discoveryQuestions.push('Who is the primary audience for this project?');
  discoveryQuestions.push('Do you have existing brand assets (logo, colors, content)?');

  // Determine qualification status
  let qualificationStatus = 'NEW';
  if (missingInfo.length > 2) {
    qualificationStatus = 'NEEDS CLIENT INFORMATION';
  } else if (description.length > 50 && projectType && budgetRange) {
    qualificationStatus = 'NEEDS REVIEW';
  }

  // Determine recommended next action
  let recommendedAction;
  if (qualificationStatus === 'NEEDS CLIENT INFORMATION') {
    recommendedAction = 'Send follow-up to collect missing information';
  } else if (qualificationStatus === 'NEEDS REVIEW') {
    recommendedAction = 'Review project details and schedule discovery call';
  } else {
    recommendedAction = 'Initial review and qualification';
  }

  // Generate follow-up draft for missing info
  let followUpDraft = '';
  if (missingInfo.length > 0) {
    followUpDraft = `Hi ${name.split(' ')[0] || 'there'},\n\nThanks again for your interest in working with Cod3Black Agency on "${projectName}".\n\nTo help us prepare the best proposal for your project, could you share a few more details?\n\n`;
    missingInfo.forEach((info) => {
      followUpDraft += `- ${info}\n`;
    });
    followUpDraft += `\nThe more we know upfront, the more accurate our proposal will be.\n\nLooking forward to learning more about your project!\n\n— Cod3Black Agency`;
  }

  const triage = {
    clientObjective,
    requestedService: projectType || 'Not specified',
    businessType,
    existingWebsite: currentWebsite || 'None provided',
    desiredOutcome: desiredOutcome || 'Not specified',
    requestedDeadline: timeline || 'Not specified',
    availableBudget: budgetRange || 'Not specified',
    missingInformation: missingInfo,
    technicalComplexity,
    businessValue,
    deliveryRisk,
    recommendedDiscoveryQuestions: discoveryQuestions,
    recommendedNextAction: recommendedAction,
    qualificationStatus,
  };

  return { triage, followUpDraft };
}

export async function POST(request) {
  try {
    const { requestId } = await request.json();

    if (!requestId) {
      return Response.json(
        { success: false, error: 'requestId is required' },
        { status: 400 }
      );
    }

    // Fetch the project request
    const result = await getProjectRequestById(requestId);
    if (!result.success || !result.data) {
      return Response.json(
        { success: false, error: 'Project request not found' },
        { status: 404 }
      );
    }

    const projectRequest = result.data;

    // Generate triage analysis
    const { triage, followUpDraft } = generateTriage(projectRequest);

    // Save triage to database
    const triageJson = JSON.stringify(triage);
    const qualResult = await updateProjectRequestQualification(
      requestId,
      triage.qualificationStatus,
      triage.clientObjective,
      triageJson
    );

    if (!qualResult.success) {
      console.error('[api/triage] Failed to save triage:', qualResult.error);
      return Response.json(
        { success: false, error: 'Failed to save triage analysis' },
        { status: 500 }
      );
    }

    // Save follow-up draft if needed
    if (followUpDraft) {
      await updateProjectRequestFollowUp(requestId, followUpDraft);
    }

    return Response.json({
      success: true,
      requestId,
      triage,
      followUpDraft: followUpDraft || null,
      qualificationStatus: triage.qualificationStatus,
    });
  } catch (error) {
    console.error('[api/triage] Error:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
