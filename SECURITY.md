# Security policy

## Supported versions

Security fixes are applied to the latest published minor release.

## Reporting a vulnerability

Do not open a public issue. Use GitHub's **Report a vulnerability** action in the repository Security tab to submit a private advisory. Include the affected export and version, reproduction, impact, and any suggested mitigation.

We aim to acknowledge valid reports within three business days. Coordinated disclosure is requested until a fixed release is available.

## Supply chain

- CI runs dependency audit, type, test, browser, accessibility, package, and size checks.
- Releases are created by GitHub Actions using npm Trusted Publishing and provenance attestations.
- React is a peer dependency and package exports are explicit.
- Dependabot monitors npm and GitHub Actions dependencies.
