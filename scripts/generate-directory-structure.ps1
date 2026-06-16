$dirs = @(
    "apps",
    "apps\web",
    "apps\api",

    "agents",
    "agents\pm-agent",
    "agents\architect-agent",
    "agents\engineer-agent",
    "agents\qa-agent",
    "agents\reviewer-agent",

    "packages",
    "packages\band-client",
    "packages\shared-types",
    "packages\prompts",
    "packages\workflows",

    #"docs",

    ".github",
    ".github\workflows"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

$files = @(
    "README.md",

    #"docs\product-design.md",
    "docs\architecture.md",
    "docs\demo-script.md",

    "agents\pm-agent\README.md",
    "agents\architect-agent\README.md",
    "agents\engineer-agent\README.md",
    "agents\qa-agent\README.md",
    "agents\reviewer-agent\README.md"
)

foreach ($file in $files) {
    New-Item -ItemType File -Force -Path $file | Out-Null
}

Write-Host "Project structure created successfully."