# Setup cargo-component

🦀 Install the [`cargo component`](https://github.com/bytecodealliance/cargo-component) subcommand for GitHub Actions

<table align=center><td>

```yaml
- uses: jcbhmr/setup-cargo-component@v1
- run: cargo component build
```

</table>

✅ Installs the `cargo-component` CLI globally \
📌 Supports version pinning \
⚡ Caches the installation in `$RUNNER_TOOL_CACHE` \
📥 Downloads from [the cargo-component GitHub releases](https://github.com/bytecodealliance/cargo-component/releases)

## Usage

![GitHub Actions](https://img.shields.io/static/v1?style=for-the-badge&message=GitHub+Actions&color=2088FF&logo=GitHub+Actions&logoColor=FFFFFF&label=)
![GitHub](https://img.shields.io/static/v1?style=for-the-badge&message=GitHub&color=181717&logo=GitHub&logoColor=FFFFFF&label=)

**🚀 Here's what you're after:**

```yml
on: push
jobs:
  job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: jcbhmr/setup-cargo-component@v1
      - run: cargo component build
```

### Inputs

- **`cargo-component-version`:** Which version of cargo-component to install. This can be an exact version specifier such as `0.7.0` or a semver range like `~0.7.0` or `0.x`. Use `latest` to always install the latest release. Defaults to `latest`.

- **`cargo-component-token`:** The GitHub token to use when fetching the version list from [bytecodealliance/cargo-component](https://github.com/bytecodealliance/cargo-component/releases). You shouldn't have to touch this. The default is the `github.token` if you're on github.com or unauthenticated (rate limited) if you're not on github.com.

### Outputs

- **`cargo-component-version`:** The version of cargo-component that was installed. This will be something like `0.7.0` or similar.

- **`cache-hit`:** Whether or not cargo-component was restored from the runner's cache or download anew.

## Development

![Bun](https://img.shields.io/static/v1?style=for-the-badge&message=Bun&color=000000&logo=Bun&logoColor=FFFFFF&label=)
![GitHub Actions](https://img.shields.io/static/v1?style=for-the-badge&message=GitHub+Actions&color=2088FF&logo=GitHub+Actions&logoColor=FFFFFF&label=)

This GitHub Action uses Bun to bundle the main entry point plus all the imported dependencies into a single `.js` file ready to be run by `main: dist/main.js` in the `action.yml`. To test the action just open a PR (even a draft one) and some magic GitHub Actions will test your changes. 🧙‍♂️

ℹ Once [Bun gets Windows support](https://github.com/oven-sh/bun/issues/43) make sure you add back the `runs-on: windows-latest` test to `test-action.yml`.
