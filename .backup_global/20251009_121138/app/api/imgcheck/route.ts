import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams.get("u");
  if (!u) return NextResponse.json({ ok:false, error:"missing u" }, { status: 400 });
  try{
    const r = await fetch(u, { method:"HEAD" });
    return NextResponse.json({ ok:r.ok, status:r.status, url:u });
  }catch(e:any){
    return NextResponse.json({ ok:false, error:String(e), url:u }, { status: 500 });
  }
}
