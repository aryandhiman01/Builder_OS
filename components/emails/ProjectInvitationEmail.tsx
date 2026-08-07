import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
} from "@react-email/components";

interface ProjectInvitationEmailProps {
  inviterName: string;
  projectName: string;
  inviteUrl: string;
}

export default function ProjectInvitationEmail({
  inviterName,
  projectName,
  inviteUrl,
}: ProjectInvitationEmailProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`You're invited to join ${projectName}`}</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#09090b",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ backgroundColor: "#09090b", padding: "40px 20px" }}
        >
          <tr>
            <td align="center">
              <table
                width="560"
                cellPadding={0}
                cellSpacing={0}
                style={{
                  maxWidth: "560px",
                  width: "100%",
                  backgroundColor: "#111113",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <tr>
                  <td
                    style={{
                      background:
                        "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                      padding: "40px 40px 32px",
                      textAlign: "center",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {/* Logo */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "52px",
                        height: "52px",
                        borderRadius: "14px",
                        background:
                          "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        marginBottom: "20px",
                      }}
                    >
                      <span
                        style={{
                          color: "#fff",
                          fontSize: "22px",
                          fontWeight: "700",
                          lineHeight: 1,
                        }}
                      >
                        B
                      </span>
                    </div>

                    <div
                      style={{
                        color: "#ffffff",
                        fontSize: "13px",
                        fontWeight: "600",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        opacity: 0.6,
                        marginBottom: "8px",
                      }}
                    >
                      Builder OS
                    </div>

                    <h1
                      style={{
                        margin: 0,
                        color: "#ffffff",
                        fontSize: "26px",
                        fontWeight: "700",
                        lineHeight: "1.3",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      You&apos;ve been invited
                    </h1>
                  </td>
                </tr>

                {/* Body */}
                <tr>
                  <td style={{ padding: "36px 40px" }}>
                    <p
                      style={{
                        margin: "0 0 20px",
                        color: "#a1a1aa",
                        fontSize: "15px",
                        lineHeight: "1.6",
                      }}
                    >
                      Hey there! 👋
                    </p>

                    <p
                      style={{
                        margin: "0 0 20px",
                        color: "#a1a1aa",
                        fontSize: "15px",
                        lineHeight: "1.6",
                      }}
                    >
                      <strong style={{ color: "#ffffff" }}>{inviterName}</strong>{" "}
                      has invited you to collaborate on their project on Builder
                      OS.
                    </p>

                    {/* Project card */}
                    <div
                      style={{
                        backgroundColor: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "12px",
                        padding: "20px 24px",
                        margin: "28px 0",
                      }}
                    >
                      <div
                        style={{
                          color: "#71717a",
                          fontSize: "11px",
                          fontWeight: "600",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          marginBottom: "8px",
                        }}
                      >
                        Project
                      </div>
                      <div
                        style={{
                          color: "#ffffff",
                          fontSize: "18px",
                          fontWeight: "700",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {projectName}
                      </div>
                    </div>

                    <p
                      style={{
                        margin: "0 0 28px",
                        color: "#a1a1aa",
                        fontSize: "14px",
                        lineHeight: "1.6",
                      }}
                    >
                      As a team member you&apos;ll be able to access Research,
                      PRD, Roadmap, Architecture, and Tasks for this project.
                    </p>

                    {/* CTA Button */}
                    <table width="100%" cellPadding={0} cellSpacing={0}>
                      <tr>
                        <td align="center">
                          <a
                            href={inviteUrl}
                            style={{
                              display: "inline-block",
                              background:
                                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                              color: "#ffffff",
                              fontSize: "15px",
                              fontWeight: "600",
                              textDecoration: "none",
                              padding: "14px 36px",
                              borderRadius: "10px",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            Accept Invitation →
                          </a>
                        </td>
                      </tr>
                    </table>

                    {/* Fallback URL */}
                    <p
                      style={{
                        margin: "24px 0 0",
                        color: "#52525b",
                        fontSize: "12px",
                        lineHeight: "1.6",
                        textAlign: "center",
                      }}
                    >
                      Or copy and paste this link in your browser:
                      <br />
                      <a
                        href={inviteUrl}
                        style={{ color: "#6366f1", wordBreak: "break-all" }}
                      >
                        {inviteUrl}
                      </a>
                    </p>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td
                    style={{
                      padding: "24px 40px",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#3f3f46",
                        fontSize: "12px",
                        lineHeight: "1.6",
                      }}
                    >
                      This invitation expires in 7 days.
                      <br />
                      If you weren&apos;t expecting this email, you can safely
                      ignore it.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
