/**
 * API Route: /api/inquiry
 * Handles inquiry form submissions
 */

export async function POST(request) {
  try {
    const formData = await request.json();

    // Generate estimate
    const estimate = estimateProjectScope(formData);

    // In a real implementation, save to database here
    // For now, just log and return success
    const inquiryId = 'inq_' + Date.now();
    
    console.log('New inquiry received:', {
      inquiryId,
      projectName: formData.projectName,
      email: formData.email,
      estimate,
      timestamp: new Date().toISOString(),
    });

    // In production:
    // 1. Save to database
    // 2. Send auto-response email to prospect
    // 3. Send internal notification to team
    // 4. Add to Slack notification

    return Response.json({
      success: true,
      inquiryId,
      estimate,
      message: 'Inquiry submitted. We will review and contact you within 24 hours.',
    }, { status: 200 });

  } catch (error) {
    console.error('Inquiry submission error:', error);
    return Response.json({
      success: false,
      error: 'Failed to submit inquiry. Please try again.',
    }, { status: 500 });
  }
}

/**
 * Estimate project scope based on form responses
 */
function estimateProjectScope(data) {
  let estimatedHours = 20; // baseline
  let tier = 'Starter';
  let complexity = 'simple';
  let hourlyRate = 125; // default rate

  // Token volume impact
  if (data.tokenVolume === '1m-10m') estimatedHours += 15;
  if (data.tokenVolume === '10m-100m') estimatedHours += 30;
  if (data.tokenVolume === 'over-100m') estimatedHours += 50;

  // Document processing impact
  if (data.documentsPerMonth === '100-1k') estimatedHours += 10;
  if (data.documentsPerMonth === '1k-10k') estimatedHours += 20;
  if (data.documentsPerMonth === 'over-10k') estimatedHours += 40;

  // Webhooks/integrations complexity
  if (data.webhooksNeeded === 'moderate') estimatedHours += 15;
  if (data.webhooksNeeded === 'complex') {
    estimatedHours += 40;
    complexity = 'complex';
  }

  // Team level adjustment
  if (data.teamLevel === 'non-tech') estimatedHours += 10;

  // Special requirements
  if (data.specialRequirements?.includes('compliance')) estimatedHours += 30;
  if (data.specialRequirements?.includes('high-availability')) estimatedHours += 20;

  // Determine tier based on total hours
  if (estimatedHours > 60 && estimatedHours <= 100) {
    tier = 'Professional';
    complexity = 'moderate';
  } else if (estimatedHours > 100) {
    tier = 'Enterprise';
    complexity = 'complex';
  }

  // Cap at reasonable values
  if (estimatedHours > 200) estimatedHours = 200;

  // Check partner qualification for discount
  const isPartnerQualified = data.partnerQualification && data.partnerQualification !== 'none';
  if (isPartnerQualified) {
    hourlyRate = 65; // Partner rate
  }

  // Calculate pricing tiers with appropriate rates
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
    monthlyRate = isPartnerQualified ? 10400 : 20000; // 160 hours × $65 or $125
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
    estimatedDuration: (
      estimatedHours <= 40 ? '2-4 weeks' :
      estimatedHours <= 80 ? '4-8 weeks' :
      estimatedHours <= 160 ? '8-16 weeks' :
      '16+ weeks'
    ),
    disclaimer: 'This is a rough estimate based on your responses. We will refine during our discovery call.',
    partnerSavings: isPartnerQualified ? Math.ceil((starterHours * 60 * 12)) : null,
  };
}
