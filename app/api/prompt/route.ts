import 'server-only';

import { NextResponse } from 'next/server';

import { sampleProfile, setPatientType, setProfile } from '@/app/api/getDataFromKV';

export async function POST(request: Request) {
  try {
    request.json().then((data) => {
      setPatientType(data.patientType);
    });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error in POST' }, { status: 500 });
  }
  return NextResponse.json({ message: 'Patient type submitted successfully' });
}

export async function GET() {
  try {
    const profile = await sampleProfile();
    await setProfile(profile);
    return NextResponse.json({ profile: profile });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error in GET' }, { status: 500 });
  }
}
