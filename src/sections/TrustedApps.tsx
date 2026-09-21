import './TrustedApps.css'

const IMAGE_BASE =
  'https://cdn.sanity.io/images/9r24npb8/production'

const iconFiles = [
  '76497a9a6b355c150821e7c05f065dacdb6379e8-225x225.jpg',
  '35cad1e61bca6653b4619de17fb70f4521e0ea2d-350x350.png',
  '4ec7d9eeced2ced62f0c62123fbfa65a2273f07d-512x512.png',
  'afb01dfbefff075a64e75c221ed23862a652f0af-350x350.png',
  '3a644d07652bc6bcb495767f456981eaec1e1d20-460x460.webp',
  '2f8fc6504f74ab3f6202f6959881be262e662e2f-460x460.webp',
  '5e72c6219cda0bad12d71d279b7fbb6c4fb4265f-225x225.png',
  '637a1373281437aebaa399ec125743fb0b4667b4-350x350.png',
  '368dd61778060b2ba0b75786a06ab12af3d19efe-500x500.svg',
  '6f13296141189fe9302e66e8f1982cd66d99b204-350x350.png',
  '02e4ed3355424bed8579b0fad3125db1565dc1ad-200x200.png',
  'e6b569664f17fd68bc47321e24b025c2b271b0bb-512x512.png',
  'ecf245f860230ad30f28b66266c99cb5b249c9da-1024x1024.png',
  '6cea83df40cd6ad564522d7cc22e6b3ae1b675e6-1024x1024.png',
  'db526e2a669aafdbcd2fce009aba0fb796798d9c-434x434.webp',
  '290feb0784c1a1c3b51ec625b74a607bc80df269-434x434.webp',
  '5425416a4efc751eec13d878ad58a238fed7151e-434x434.webp',
  '83b525788456450f6031050f47d60a228d146b78-434x434.webp',
  '6f5af7b185d9af3b75429ffce5a8ee26dcfbb16d-400x400.webp',
  '83fd5d87b2c9ba4673bec00aecd2cbb100f564e0-200x200.webp',
]

function getIconUrl(file: string) {
  const url = `${IMAGE_BASE}/${file}`

  return file.endsWith('.svg')
    ? url
    : `${url}?auto=format&fit=max&q=75&w=80`
}

export default function TrustedApps() {
  return (
    <section
      className="trusted-apps"
      aria-labelledby="trusted-apps-heading"
    >
      <h2
        id="trusted-apps-heading"
        className="trusted-apps__heading"
      >
        3M+ developers. 50K+ GitHub stars. Trusted in production by:
      </h2>

      <div
        className="trusted-apps__viewport"
        aria-hidden="true"
      >
        <div className="trusted-apps__track">
          {[0, 1].map((copy) => (
            <div
              className="trusted-apps__group"
              key={copy}
            >
              {iconFiles.map((file) => (
                <img
                  key={file}
                  className="trusted-apps__icon"
                  src={getIconUrl(file)}
                  alt=""
                  width="40"
                  height="40"
                  draggable={false}
                  decoding="async"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}