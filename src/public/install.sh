#!/bin/sh
#
# Boltstore install script
# Downloads and installs the latest Boltstore binary from GitHub Releases.
#
# Usage:
#   curl -fsSL https://boltstore.dev/install.sh | bash
#   curl -fsSL https://boltstore.dev/install.sh | bash -s -- --version v1.0.0
#   curl -fsSL https://boltstore.dev/install.sh | bash -s -- --dir /usr/local/bin

set -eu

GITHUB_OWNER="boltstore"
GITHUB_REPO="boltstore"
INSTALL_DIR="/usr/local/bin"
VERSION="latest"

print_help() {
  cat <<EOF
Boltstore install script

Usage:
  curl -fsSL https://boltstore.dev/install.sh | bash
  curl -fsSL https://boltstore.dev/install.sh | bash -s -- [options]

Options:
  --version <tag>    Install a specific version (e.g. v1.0.0). Default: latest
  --dir <path>       Installation directory. Default: /usr/local/bin
  -h, --help         Show this help message
EOF
}

# Parse arguments
while [ $# -gt 0 ]; do
  case "$1" in
    --version)
      VERSION="$2"
      shift 2
      ;;
    --dir)
      INSTALL_DIR="$2"
      shift 2
      ;;
    -h|--help)
      print_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      print_help
      exit 1
      ;;
  esac
done

# Detect OS
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Darwin)
    OS="darwin"
    ;;
  Linux)
    OS="linux"
    ;;
  *)
    echo "Unsupported OS: $OS"
    echo "Please download the binary manually from https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases"
    exit 1
    ;;
esac

case "$ARCH" in
  arm64|aarch64)
    ARCH="arm64"
    ;;
  x86_64|amd64)
    ARCH="x64"
    ;;
  *)
    echo "Unsupported architecture: $ARCH"
    echo "Please download the binary manually from https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases"
    exit 1
    ;;
esac

BINARY_NAME="boltstore-${OS}-${ARCH}"
if [ "$OS" = "windows" ]; then
  BINARY_NAME="${BINARY_NAME}.exe"
fi

# Resolve the download URL
if [ "$VERSION" = "latest" ]; then
  DOWNLOAD_URL="https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest/download/${BINARY_NAME}"
else
  DOWNLOAD_URL="https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/${VERSION}/${BINARY_NAME}"
fi

echo "Boltstore installer"
echo "  OS:       ${OS}-${ARCH}"
echo "  Version:  ${VERSION}"
echo "  Install:  ${INSTALL_DIR}/boltstore"
echo ""

# Check if install dir is writable
if [ ! -d "$INSTALL_DIR" ]; then
  echo "Creating install directory: ${INSTALL_DIR}"
  mkdir -p "$INSTALL_DIR" 2>/dev/null || {
    echo "Cannot create ${INSTALL_DIR}. Try with sudo or use --dir to specify a different path."
    exit 1
  }
fi

if [ ! -w "$INSTALL_DIR" ]; then
  echo "Install directory ${INSTALL_DIR} is not writable. Using sudo."
  SUDO="sudo"
else
  SUDO=""
fi

# Download
TMP_FILE=$(mktemp)
echo "Downloading ${DOWNLOAD_URL}..."
if ! curl -fsSL "$DOWNLOAD_URL" -o "$TMP_FILE"; then
  echo ""
  echo "Download failed. The binary for ${OS}-${ARCH} may not exist for this release."
  echo "Please check https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases for available assets."
  rm -f "$TMP_FILE"
  exit 1
fi

# Make executable
chmod +x "$TMP_FILE"

# Install
echo "Installing to ${INSTALL_DIR}/boltstore..."
if [ -n "$SUDO" ]; then
  $SUDO mv "$TMP_FILE" "${INSTALL_DIR}/boltstore"
else
  mv "$TMP_FILE" "${INSTALL_DIR}/boltstore"
fi

# Verify
echo ""
INSTALLED_PATH="${INSTALL_DIR}/boltstore"
if command -v boltstore >/dev/null 2>&1; then
  echo "Boltstore installed successfully!"
  echo ""
  echo "  $(boltstore --version 2>/dev/null || echo "boltstore")"
  echo ""
  echo "Run 'boltstore serve' to start the server."
  echo "Dashboard will be available at http://localhost:8080/dashboard"
else
  echo "Boltstore installed to ${INSTALLED_PATH}"
  echo ""
  echo "Note: ${INSTALL_DIR} is not on your PATH. Add it or run Boltstore directly:"
  echo "  ${INSTALLED_PATH} serve"
fi