import { insertInquiry } from '@/lib/db';
import { sendInquiryNotifications } from '@/lib/resend';

const projectTypeLabels = {
  website: 'Website',
  'web-app': 'Web App',
  'mobile-app': 'Mobile App',
  integration: 'Integration',
  redesign: 'Redesign',
  mvp: 'MVP',
  other: 'Other',
};

export async function POST(request) {
  try {
    const formData = await request.json();
    const estimate = estimateProjectScope(formData);

    const dbResult = await insertInquiry(formData, estimate);
    const inquiryId = dbResult.success ? dbResult.id : `inq_${Date.now()}`;

    // Always attempt email notifications, even if DB is not configured.
    const emailResult = await sendInquiryNotifications(formData, estimate, inquiryId);

    if (!dbResult.success && dbResult.reason !== 'not_configured') {
      console.error('[api/inquiry] Database insert failed:', dbResult.error);
      return Response.json(
        { success: false, error: 'Failed to save inquiry. Please try again.' },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        inquiryId,
        estimate,
        dbSaved: dbResult.success,
        emailSent: emailResult.success,
        message: 'Inquiry submitted. We will review and contact you within 24 hours.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[api/inquiry] Inquiry submission error:', error);
    return Response.json(
      { success: false, error: 'Failed to submit inquiry. Please try again.' },
      { status: 500 }
    );
  }
}

function estimateProjectScope(data) {
  let estimatedHours = 20;
  let tier = 'Starter';
  let complexity = 'simple';
  let hourlyRate = 125;

  if (data.projectType === 'website') estimatedHours = 20;
  if (data.projectType === 'web-app') estimatedHours = 60;
  if (data.projectType === 'mobile-app') estimatedHours = 100;
  if (data.projectType === 'mvp') estimatedHours = 40;
  if (data.projectType === 'redesign') estimatedHours = 30;
  if (data.projectType === 'integration') estimatedHours = 20;

  if (data.designScope === 'moderate') estimatedHours += 15;
  if (data.designScope === 'custom') {
    estimatedHours += 40;
    complexity = 'moderate';
  }

  if (data.databaseNeeded === 'simple') estimatedHours += 10;
  if (data.databaseNeeded === 'complex') {
    estimatedHours += 30;
    complexity = 'complex';
  }

  if (data.integrationCount === '1-2') estimatedHours += 5;
  if (data.integrationCount === '3-5') estimatedHours += 15;
  if (data.integrationCount === '5-plus') {
    estimatedHours += 30;
    complexity = 'complex';
  }

  const platforms = data.deploymentRequirements || [];
  if (platforms.includes('ios')) estimatedHours += 30;
  if (platforms.includes('android')) estimatedHours += 30;

  if (data.teamLevel === 'non-tech') estimatedHours += 10;

  if (data.specialRequirements?.includes('compliance')) estimatedHours += 20;
  if (data.specialRequirements?.includes('performance')) estimatedHours += 15;
  if (data.specialRequirements?.includes('seo')) estimatedHours += 10;
  if (data.specialRequirements?.includes('training')) estimatedHours += 15;

  if (estimatedHours > 60 && estimatedHours <= 100) {
    tier = 'Professional';
    complexity = 'moderate';
  } else if (estimatedHours > 100) {
    tier = 'Enterprise';
    complexity = 'complex';
  }

  if (estimatedHours > 250) estimatedHours = 250;

  const isPartnerQualified = data.partnerQualification && data.partnerQualification !== 'none';
  if (isPartnerQualified) hourlyRate = 65;

  const starterHours = 20;
  const proHours = 60;
  const enterpriseHours = 160;

  let monthlyRate, setupFee, hoursPerMonth;

  if (tier === 'Starter') {
    monthlyRate = Math.ceil((starterHours * hourlyRate) / 100) * 100;
    setupFee = monthlyRate;
    hoursPerMonth = starterHours;
  } else if (tier === 'Professional') {
    monthlyRate = Math.ceil((proHours * hourlyRate) / 100) * 100;
    setupFee = isPartnerQualified ? 3000 : 5000;
    hoursPerMonth = proHours;
  } else {
    monthlyRate = isPartnerQualified ? 10400 : 20000;
    setupFee = isPartnerQualified ? 10400 : 20000;
    hoursPerMonth = enterpriseHours;
  }

  return {
    estimatedHours: Math.ceil(estimatedHours / 10) * 10,
    tier,
    complexity,
    hourlyRate,
    isPartnerQualified,
    monthlyRate,
    hoursPerMonth,
    setupFee,
    estimatedDuration:
      estimatedHours <= 40
        ? '2-4 weeks'
        : estimatedHours <= 80
          ? '4-8 weeks'
          : estimatedHours <= 160
            ? '8-16 weeks'
            : '16+ weeks',
    disclaimer: 'This is a rough estimate based on your responses. We will refine during our discovery call.',
    projectTypeLabel: projectTypeLabels[data.projectType] || 'Project',
  };
}
