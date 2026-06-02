import { NextResponse } from "next/server";
import { transporter } from "@/lib/nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, phone, message } = body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "zmnobab1999@gmail.com",
      replyTo: email,
      subject: `📩 New Contact Message from ${name}`,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 40px 20px;
        ">
          <div style="
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          ">
            
            <div style="
              background: linear-gradient(135deg, #FF7EB3, #DC3173);
              padding: 30px;
              text-align: center;
            ">
              <h1 style="
                color: white;
                margin: 0;
                font-size: 28px;
              ">
                New Contact Message
              </h1>
            </div>

            <div style="padding: 30px;">
              
              <div style="
                margin-bottom: 20px;
                padding: 16px;
                background: #f9fafb;
                border-radius: 12px;
              ">
                <p style="margin: 0 0 8px;">
                  <strong>Name:</strong>
                </p>
                <p style="margin: 0; color: #374151;">
                  ${name}
                </p>
              </div>

              <div style="
                margin-bottom: 20px;
                padding: 16px;
                background: #f9fafb;
                border-radius: 12px;
              ">
                <p style="margin: 0 0 8px;">
                  <strong>Email:</strong>
                </p>
                <p style="margin: 0; color: #374151;">
                  ${email}
                </p>
              </div>

              <div style="
                margin-bottom: 20px;
                padding: 16px;
                background: #f9fafb;
                border-radius: 12px;
              ">
                <p style="margin: 0 0 8px;">
                  <strong>Phone:</strong>
                </p>
                <p style="margin: 0; color: #374151;">
                  ${phone || "Not Provided"}
                </p>
              </div>

              <div style="
                margin-bottom: 20px;
                padding: 16px;
                background: #f9fafb;
                border-radius: 12px;
              ">
                <p style="margin: 0 0 12px;">
                  <strong>Message:</strong>
                </p>
                <p style="
                  margin: 0;
                  color: #374151;
                  line-height: 1.7;
                ">
                  ${message}
                </p>
              </div>

            </div>

            <div style="
              padding: 20px;
              text-align: center;
              background: #f3f4f6;
              color: #6b7280;
              font-size: 14px;
            ">
              © ${new Date().getFullYear()} Deligo Contact System
            </div>

          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log("EMAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email",
      },
      { status: 500 },
    );
  }
}