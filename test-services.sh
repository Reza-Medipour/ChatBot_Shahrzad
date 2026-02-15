#!/bin/bash

# رنگ‌ها
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}         🧪 تست سرویس‌های پروژه${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# چک کردن Docker containers
echo -e "${BLUE}1️⃣  وضعیت کانتینرها:${NC}"
docker-compose ps
echo ""

# چک کردن پورت 8090
echo -e "${BLUE}2️⃣  چک کردن پورت 8090:${NC}"
if netstat -tuln 2>/dev/null | grep -q :8090 || ss -tuln 2>/dev/null | grep -q :8090; then
    echo -e "${GREEN}✓ پورت 8090 باز است${NC}"
else
    echo -e "${RED}✗ پورت 8090 باز نیست!${NC}"
fi
echo ""

# تست Nginx
echo -e "${BLUE}3️⃣  تست Nginx (پورت 8090):${NC}"
if curl -sf http://localhost:8090/ > /dev/null; then
    echo -e "${GREEN}✓ Nginx کار می‌کند${NC}"
else
    echo -e "${RED}✗ Nginx پاسخ نمی‌دهد${NC}"
fi
echo ""

# تست Frontend
echo -e "${BLUE}4️⃣  تست Frontend:${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Frontend در دسترس است (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${YELLOW}⚠ Frontend وضعیت: HTTP $HTTP_CODE${NC}"
fi
echo ""

# تست Backend API Docs
echo -e "${BLUE}5️⃣  تست Backend API:${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/docs)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Backend API در دسترس است (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${YELLOW}⚠ Backend API وضعیت: HTTP $HTTP_CODE${NC}"
fi
echo ""

# تست Database
echo -e "${BLUE}6️⃣  تست Database:${NC}"
if docker-compose exec -T database pg_isready -U shahrzad -d shahrzad_db > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Database آماده است${NC}"
else
    echo -e "${RED}✗ Database آماده نیست${NC}"
fi
echo ""

# خلاصه
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}         📊 خلاصه${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}🌐 دسترسی:${NC}"
echo -e "   Frontend:    ${GREEN}http://103.75.196.71:8090/${NC}"
echo -e "   Backend API: ${GREEN}http://103.75.196.71:8090/api/${NC}"
echo -e "   API Docs:    ${GREEN}http://103.75.196.71:8090/docs${NC}"
echo ""
echo -e "${YELLOW}💡 برای مشاهده لاگ‌ها:${NC}"
echo -e "   docker-compose logs -f"
echo ""
