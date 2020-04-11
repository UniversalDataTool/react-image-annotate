module.exports = {
  branch: "master",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/npm", { npmPublish: false }],
    ["@semantic-release/npm", { npmPublish: true, pkgRoot: "dist" }],
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        assets: ["package.json"],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
}
