import * as React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

// Shared NDH Agency email frame: navy header band, white card, cyan accent.
export const SITE_URL = 'https://agency.ndh.com.ng'
export const brand = {
  navy: '#091b3f',
  navy2: '#13285c',
  cyan: '#55d5fb',
  primary: '#3159c6',
  text: '#1d2a44',
  muted: '#5b6782',
  porcelain: '#f3f6fb',
  border: '#e3e9f3',
}
const font = "'DM Sans', 'Segoe UI', Helvetica, Arial, sans-serif"
const headFont = "'Space Grotesk', 'Segoe UI', Helvetica, Arial, sans-serif"

export function EmailLayout({
  preview,
  title,
  children,
}: {
  preview: string
  title: string
  children: React.ReactNode
}) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: font, margin: 0, padding: '24px 0' }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', border: `1px solid ${brand.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <Section style={{ backgroundColor: brand.navy, padding: '28px 32px' }}>
            <Text style={{ margin: 0, color: brand.cyan, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Najeeb Digital Hub
            </Text>
            <Text style={{ margin: '2px 0 0', color: '#ffffff', fontFamily: headFont, fontSize: '22px', fontWeight: 800, letterSpacing: '0.5px' }}>
              NDH AGENCY
            </Text>
            <div style={{ marginTop: '14px', height: '3px', width: '48px', backgroundColor: brand.cyan, borderRadius: '2px' }} />
          </Section>
          <Section style={{ padding: '32px' }}>
            <Heading style={{ margin: '0 0 16px', fontFamily: headFont, fontSize: '24px', lineHeight: '1.3', color: brand.navy }}>
              {title}
            </Heading>
            {children}
          </Section>
          <Section style={{ backgroundColor: brand.porcelain, padding: '20px 32px' }}>
            <Text style={{ margin: 0, fontSize: '12px', lineHeight: '1.6', color: brand.muted }}>
              NDH Agency · Managed digital services ·{' '}
              <Link href={SITE_URL} style={{ color: brand.primary }}>agency.ndh.com.ng</Link>
              <br />
              Questions? Reply to this email or write to hello@ndh.com.ng.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const P = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ margin: '0 0 14px', fontSize: '15px', lineHeight: '1.65', color: brand.text }}>{children}</Text>
)

export const CTA = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Section style={{ margin: '8px 0 20px' }}>
    <Button href={href} style={{ backgroundColor: brand.primary, color: '#ffffff', fontFamily: headFont, fontWeight: 700, fontSize: '15px', padding: '13px 26px', borderRadius: '10px', textDecoration: 'none' }}>
      {children}
    </Button>
  </Section>
)

export const Details = ({ rows }: { rows: Array<[string, string | undefined]> }) => (
  <Section style={{ backgroundColor: brand.porcelain, borderRadius: '12px', padding: '16px 20px', margin: '4px 0 20px' }}>
    {rows
      .filter(([, v]) => v)
      .map(([k, v]) => (
        <Text key={k} style={{ margin: '4px 0', fontSize: '14px', color: brand.text }}>
          <span style={{ color: brand.muted }}>{k}: </span>
          <strong>{v}</strong>
        </Text>
      ))}
  </Section>
)

export const Divider = () => <Hr style={{ borderColor: brand.border, margin: '20px 0' }} />
