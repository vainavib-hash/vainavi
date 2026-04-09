#!/bin/bash
# navigation.sh - Quick navigation script for all documentation

echo "════════════════════════════════════════════════════════════════"
echo "   Code Generation System - Documentation Navigator"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create index
declare -a docs=(
    "QUICK_START.md:Get started in minutes"
    "docs/INSTALL.md:Complete installation guide"
    "README.md:Main project overview"
    "docs/ARCHITECTURE.md:System architecture details"
    "docs/USAGE.md:Detailed usage guide"
    "USAGE.md:Usage examples and patterns"
    "docs/GETTING_STARTED.md:Beginner guide"
    "docs/DEPLOYMENT.md:Production deployment"
    "docs/API_SPECIFICATION.md:API endpoints documentation"
    "docs/SAMPLE_DATA.md:Database seed data and examples"
    "docs/EXTENDED_SPECIFICATIONS.md:Full application specifications"
    "docs/ADVANCED_FEATURES.md:Advanced features and patterns"
    "docs/API_RESPONSES.md:Complete API request/response examples"
    "docs/PERFORMANCE_AND_CODE.md:Benchmarks and generated code"
    "web/README.md:Web interface documentation"
)

# Function to display documentation
display_docs() {
    echo "${BLUE}📚 Available Documentation:${NC}"
    echo ""
    
    i=1
    for doc in "${docs[@]}"; do
        IFS=':' read -r file desc <<< "$doc"
        printf "%2d. ${GREEN}%-40s${NC} %s\n" $i "$file" "$desc"
        ((i++))
    done
    
    echo ""
}

# Function to open documentation
open_doc() {
    local choice=$1
    local count=${#docs[@]}
    
    if [[ ! $choice =~ ^[0-9]+$ ]] || [ $choice -lt 1 ] || [ $choice -gt $count ]; then
        echo "${RED}Invalid choice!${NC}"
        return
    fi
    
    local doc="${docs[$((choice-1))]}"
    IFS=':' read -r file desc <<< "$doc"
    
    echo "${YELLOW}Opening: $file${NC}"
    echo "$desc"
    echo ""
    
    if [ -f "$file" ]; then
        less "$file"
    else
        echo "${RED}File not found: $file${NC}"
    fi
}

# Main menu
display_menu() {
    echo "${BLUE}════════════════════════════════════════════════════════════════${NC}"
    echo "${BLUE}   Quick Navigation${NC}"
    echo "${BLUE}════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "Type a number to open a document:"
    echo ""
    display_docs
    
    echo "${YELLOW}Additional Options:${NC}"
    echo "  q   - Quit"
    echo "  l   - List all again"
    echo "  h   - Show shortcuts"
    echo ""
}

# Show shortcuts
show_shortcuts() {
    echo ""
    echo "${BLUE}═══ Keyboard Shortcuts ═══${NC}"
    echo "  q - Quit current document and return to menu"
    echo "  G - Go to end of document"
    echo "  gg - Go to beginning of document"
    echo "  / - Search in document"
    echo "  n - Next search result"
    echo "  N - Previous search result"
    echo ""
}

# Categories
show_categories() {
    echo ""
    echo "${BLUE}════════════════════════════════════════════════════════════════${NC}"
    echo "${BLUE}   Documentation by Category${NC}"
    echo "${BLUE}════════════════════════════════════════════════════════════════${NC}"
    echo ""
    
    echo "${GREEN}🚀 Getting Started:${NC}"
    echo "  1. QUICK_START.md - Start here!"
    echo "  2. docs/INSTALL.md"
    echo "  3. docs/GETTING_STARTED.md"
    echo ""
    
    echo "${GREEN}📖 Core Documentation:${NC}"
    echo "  4. README.md - Overview"
    echo "  5. docs/ARCHITECTURE.md - Design"
    echo "  6. docs/USAGE.md - How to use"
    echo ""
    
    echo "${GREEN}🔧 Technical Details:${NC}"
    echo "  7. docs/API_SPECIFICATION.md - API docs"
    echo "  8. docs/API_RESPONSES.md - Examples"
    echo "  9. docs/PERFORMANCE_AND_CODE.md - Benchmarks"
    echo ""
    
    echo "${GREEN}📚 Advanced Topics:${NC}"
    echo "  10. docs/ADVANCED_FEATURES.md"
    echo "  11. docs/EXTENDED_SPECIFICATIONS.md"
    echo "  12. docs/SAMPLE_DATA.md"
    echo ""
    
    echo "${GREEN}🌐 Web Interface:${NC}"
    echo "  13. web/README.md"
    echo ""
    
    echo "${GREEN}📋 Deployment:${NC}"
    echo "  14. docs/DEPLOYMENT.md"
    echo ""
}

# Main loop
while true; do
    display_menu
    read -p "Select (1-${#docs[@]}/q/l/c/h): " input
    
    case $input in
        q|Q) 
            echo ""
            echo "${YELLOW}Goodbye!${NC}"
            exit 0
            ;;
        l|L)
            display_menu
            ;;
        c|C)
            show_categories
            ;;
        h|H)
            show_shortcuts
            ;;
        *)
            open_doc "$input"
            ;;
    esac
done
