#!/usr/bin/env node
import * as core from "@actions/core";
import * as github from "@actions/github";
import * as tc from "@actions/tool-cache";
import * as semver from "semver";
import { createUnauthenticatedAuth } from "@octokit/auth-unauthenticated";
import { join } from "node:path";
import { chmod, mkdir, rename } from "node:fs/promises";

const token = core.getInput("cargo-component-token");
const octokit = token
  ? github.getOctokit(token)
  : github.getOctokit(undefined!, {
      authStrategy: createUnauthenticatedAuth,
      auth: { reason: "no 'cargo-component-token' input" },
    });

const versionRaw = core.getInput("cargo-component-version");
let version: string;
if (versionRaw === "latest") {
  const { data } = await octokit.rest.repos.getLatestRelease({
    owner: "bytecodealliance",
    repo: "cargo-component",
  });
  version = data.tag_name.slice(1);
} else {
  const releases = await octokit.paginate(octokit.rest.repos.listReleases, {
    owner: "bytecodealliance",
    repo: "cargo-component",
  });
  const versions = releases.map((release) => release.tag_name.slice(1));
  version = semver.maxSatisfying(versions, versionRaw)!;
}
core.info(`Resolved version: v${version}`);
if (!version) throw new DOMException(`${versionRaw} resolved to ${version}`);

let found = tc.find("cargo-component", version);
core.setOutput("cache-hit", !!found);
if (!found) {
  const target = {
    "darwin,x64": "x86_64-apple-darwin",
    "darwin,arm64": "aarch64-apple-darwin",
    "linux,x64": "x86_64-unknown-linux-gnu",
    "win32,x64": "x86_64-pc-windows-gnu",
  }[[process.platform, process.arch].toString()]!;
  const file = `cargo-component-${target}`;
  const exeExt = process.platform === "win32" ? ".exe" : "";

  const url = `https://github.com/bytecodealliance/cargo-component/releases/download/v${version}/${file}`;
  core.info(`Fetching from '${url}'`);
  found = await tc.downloadTool(url);
  await chmod(found, 0o755);
  await mkdir(`${found}-folder`);
  await rename(found, join(`${found}-folder`, `cargo-component${exeExt}`));
  found = `${found}-folder`;
  core.info(`Caching '${found}' which has 'cargo-component${exeExt}' in it`);
  found = await tc.cacheDir(found, "cargo-component", version);
}
core.addPath(found);
core.setOutput("cargo-component-version", version);
core.info(`✅ cargo-component v${version} installed!`);
