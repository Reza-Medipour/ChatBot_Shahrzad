#!/bin/bash

# رنگ‌ها برای output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# توابع کمکی
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# چک کردن وجود Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker نصب نیست!"
        echo ""
        echo "برای نصب Docker از یکی از دستورات زیر استفاده کنید:"
        echo ""
        echo "روش خودکار:"
        echo "  curl -fsSL https://get.docker.com -o get-docker.sh"
        echo "  sudo sh get-docker.sh"
        echo ""
        echo "یا راهنمای کامل را در PRODUCTION-DEPLOYMENT.md مشاهده کنید"
        exit 1
    fi
    print_success "Docker نصب است"
}

# چک کردن وجود Docker Compose
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose نصب نیست!"
        echo ""
        echo "برای نصب Docker Compose:"
        echo '  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose'
        echo "  sudo chmod +x /usr/local/bin/docker-compose"
        exit 1
    fi
    print_success "Docker Compose نصب است"
}

# نمایش منوی اصلی
show_menu() {
    clear
    echo ""
    echo "═══════════════════════════════════════════════════"
    echo "    🤖 مدیریت پروژه چت بات شهرزاد"
    echo "═══════════════════════════════════════════════════"
    echo ""
    echo "1) نصب و راه‌اندازی اولیه (First Time Setup)"
    echo "2) شروع پروژه (Start)"
    echo "3) توقف پروژه (Stop)"
    echo "4) راه‌اندازی مجدد (Restart)"
    echo "5) مشاهده وضعیت سرویس‌ها (Status)"
    echo "6) مشاهده لاگ‌ها (Logs)"
    echo "7) به‌روزرسانی پروژه (Update & Rebuild)"
    echo "8) پشتیبان‌گیری از دیتابیس (Backup Database)"
    echo "9) بازگردانی پشتیبان (Restore Database)"
    echo "10) پاک‌سازی (Cleanup)"
    echo "11) تست سلامت سرویس‌ها (Health Check)"
    echo "0) خروج (Exit)"
    echo ""
    echo "═══════════════════════════════════════════════════"
    echo ""
}

# نصب و راه‌اندازی اولیه
first_time_setup() {
    print_info "شروع نصب و راه‌اندازی اولیه..."
    echo ""

    # چک کردن فایل docker-compose.yml
    if [ ! -f "docker-compose.yml" ]; then
        print_error "فایل docker-compose.yml یافت نشد!"
        exit 1
    fi

    # ایجاد فایل .env برای backend
    if [ ! -f "backend/.env" ]; then
        print_warning "فایل backend/.env وجود ندارد. آیا می‌خواهید از تنظیمات پیش‌فرض استفاده کنید؟ (y/n)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            if [ -f "backend/.env.example" ]; then
                cp backend/.env.example backend/.env
                print_success "فایل .env از .env.example کپی شد"
            fi
        fi
    fi

    print_warning "⚠️  قبل از ادامه، اطمینان حاصل کنید که:"
    echo "  1. SECRET_KEY را در docker-compose.yml تغییر داده‌اید"
    echo "  2. رمز دیتابیس را تغییر داده‌اید"
    echo "  3. LLM_API_URL را بررسی کرده‌اید"
    echo ""
    echo "آیا ادامه می‌دهیم؟ (y/n)"
    read -r continue_response

    if [[ ! "$continue_response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_info "عملیات لغو شد"
        return
    fi

    print_info "در حال ساخت و اجرای کانتینرها..."
    docker-compose up -d --build

    if [ $? -eq 0 ]; then
        echo ""
        print_success "نصب با موفقیت انجام شد!"
        echo ""
        print_info "دسترسی به سرویس‌ها:"
        echo "  • Frontend: http://localhost"
        echo "  • Backend API: http://localhost:8000"
        echo "  • API Docs: http://localhost:8000/docs"
        echo ""
        sleep 3
        show_status
    else
        print_error "خطا در راه‌اندازی پروژه!"
        echo "برای مشاهده جزئیات خطا از گزینه 'مشاهده لاگ‌ها' استفاده کنید"
    fi
}

# شروع پروژه
start_project() {
    print_info "در حال شروع پروژه..."
    docker-compose up -d

    if [ $? -eq 0 ]; then
        print_success "پروژه با موفقیت شروع شد!"
        sleep 2
        show_status
    else
        print_error "خطا در شروع پروژه!"
    fi
}

# توقف پروژه
stop_project() {
    print_info "در حال توقف پروژه..."
    docker-compose down

    if [ $? -eq 0 ]; then
        print_success "پروژه با موفقیت متوقف شد!"
    else
        print_error "خطا در توقف پروژه!"
    fi
}

# راه‌اندازی مجدد
restart_project() {
    print_info "در حال راه‌اندازی مجدد..."
    docker-compose restart

    if [ $? -eq 0 ]; then
        print_success "پروژه با موفقیت راه‌اندازی مجدد شد!"
        sleep 2
        show_status
    else
        print_error "خطا در راه‌اندازی مجدد!"
    fi
}

# نمایش وضعیت
show_status() {
    print_info "وضعیت سرویس‌ها:"
    echo ""
    docker-compose ps
    echo ""
    print_info "استفاده از منابع:"
    echo ""
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
}

# مشاهده لاگ‌ها
show_logs() {
    echo ""
    echo "کدام سرویس را می‌خواهید مشاهده کنید؟"
    echo "1) همه سرویس‌ها"
    echo "2) Backend"
    echo "3) Frontend"
    echo "4) Database"
    echo "0) بازگشت"
    echo ""
    read -r log_choice

    case $log_choice in
        1)
            print_info "نمایش لاگ همه سرویس‌ها (Ctrl+C برای خروج)..."
            docker-compose logs -f
            ;;
        2)
            print_info "نمایش لاگ Backend (Ctrl+C برای خروج)..."
            docker-compose logs -f backend
            ;;
        3)
            print_info "نمایش لاگ Frontend (Ctrl+C برای خروج)..."
            docker-compose logs -f frontend
            ;;
        4)
            print_info "نمایش لاگ Database (Ctrl+C برای خروج)..."
            docker-compose logs -f database
            ;;
        0)
            return
            ;;
        *)
            print_error "گزینه نامعتبر!"
            ;;
    esac
}

# به‌روزرسانی پروژه
update_project() {
    print_warning "این عملیات پروژه را متوقف کرده و دوباره build می‌کند."
    echo "آیا ادامه می‌دهید؟ (y/n)"
    read -r response

    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_info "در حال به‌روزرسانی..."

        # Pull latest changes (اگر از Git استفاده می‌کنید)
        if [ -d ".git" ]; then
            print_info "دریافت آخرین تغییرات از Git..."
            git pull
        fi

        # Rebuild و start
        docker-compose down
        docker-compose up -d --build

        if [ $? -eq 0 ]; then
            print_success "به‌روزرسانی با موفقیت انجام شد!"
            sleep 2
            show_status
        else
            print_error "خطا در به‌روزرسانی!"
        fi
    else
        print_info "عملیات لغو شد"
    fi
}

# پشتیبان‌گیری
backup_database() {
    print_info "در حال گرفتن پشتیبان از دیتابیس..."

    # ایجاد پوشه backup
    mkdir -p backups

    # نام فایل با تاریخ و زمان
    BACKUP_FILE="backups/shahrzad_db_$(date +%Y%m%d_%H%M%S).sql"

    docker-compose exec -T database pg_dump -U shahrzad shahrzad_db > "$BACKUP_FILE"

    if [ $? -eq 0 ]; then
        # فشرده‌سازی
        gzip "$BACKUP_FILE"
        print_success "پشتیبان‌گیری با موفقیت انجام شد!"
        print_info "فایل ذخیره شده: ${BACKUP_FILE}.gz"

        # نمایش حجم فایل
        FILESIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
        print_info "حجم فایل: $FILESIZE"
    else
        print_error "خطا در پشتیبان‌گیری!"
    fi
}

# بازگردانی پشتیبان
restore_database() {
    print_warning "⚠️  این عملیات تمام داده‌های فعلی را جایگزین می‌کند!"
    echo ""

    # لیست backup ها
    if [ ! -d "backups" ] || [ -z "$(ls -A backups/*.sql.gz 2>/dev/null)" ]; then
        print_error "هیچ فایل backup یافت نشد!"
        return
    fi

    print_info "فایل‌های backup موجود:"
    echo ""
    ls -lh backups/*.sql.gz
    echo ""

    echo "نام فایل backup را وارد کنید (بدون پسوند .gz):"
    read -r backup_file

    if [ ! -f "${backup_file}.gz" ]; then
        print_error "فایل یافت نشد!"
        return
    fi

    echo "آیا مطمئن هستید؟ (yes/no)"
    read -r response

    if [ "$response" = "yes" ]; then
        print_info "در حال بازگردانی backup..."

        gunzip < "${backup_file}.gz" | docker-compose exec -T database psql -U shahrzad -d shahrzad_db

        if [ $? -eq 0 ]; then
            print_success "بازگردانی با موفقیت انجام شد!"
        else
            print_error "خطا در بازگردانی!"
        fi
    else
        print_info "عملیات لغو شد"
    fi
}

# پاک‌سازی
cleanup() {
    echo ""
    echo "نوع پاک‌سازی را انتخاب کنید:"
    echo "1) پاک‌سازی معمولی (حذف containers متوقف و images استفاده نشده)"
    echo "2) پاک‌سازی کامل (شامل volumes - ⚠️ داده‌ها حذف می‌شوند)"
    echo "0) بازگشت"
    echo ""
    read -r cleanup_choice

    case $cleanup_choice in
        1)
            print_info "در حال پاک‌سازی معمولی..."
            docker system prune -f
            print_success "پاک‌سازی انجام شد!"
            ;;
        2)
            print_warning "⚠️  این عملیات تمام داده‌های دیتابیس را حذف می‌کند!"
            echo "برای تایید 'DELETE' را تایپ کنید:"
            read -r confirm

            if [ "$confirm" = "DELETE" ]; then
                print_info "در حال پاک‌سازی کامل..."
                docker-compose down -v
                docker system prune -a -f --volumes
                print_success "پاک‌سازی کامل انجام شد!"
            else
                print_info "عملیات لغو شد"
            fi
            ;;
        0)
            return
            ;;
        *)
            print_error "گزینه نامعتبر!"
            ;;
    esac
}

# تست سلامت
health_check() {
    print_info "در حال بررسی سلامت سرویس‌ها..."
    echo ""

    # تست Backend
    echo -n "Backend API: "
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/docs | grep -q "200"; then
        print_success "سالم"
    else
        print_error "مشکل دارد"
    fi

    # تست Frontend
    echo -n "Frontend: "
    if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200"; then
        print_success "سالم"
    else
        print_error "مشکل دارد"
    fi

    # تست Database
    echo -n "Database: "
    if docker-compose exec -T database psql -U shahrzad -d shahrzad_db -c "SELECT 1;" &> /dev/null; then
        print_success "سالم"
    else
        print_error "مشکل دارد"
    fi

    # تست اتصال به LLM API
    echo -n "LLM API: "
    if curl -s -X POST http://103.75.196.71:8020/chat \
        -H "Content-Type: application/json" \
        -d '{"session_id":"test","message":"hi"}' | grep -q "response"; then
        print_success "سالم"
    else
        print_warning "در دسترس نیست (اختیاری)"
    fi

    echo ""
}

# Main script
main() {
    # چک کردن پیش‌نیازها
    check_docker
    check_docker_compose

    # منوی اصلی
    while true; do
        show_menu
        read -r choice

        case $choice in
            1)
                first_time_setup
                ;;
            2)
                start_project
                ;;
            3)
                stop_project
                ;;
            4)
                restart_project
                ;;
            5)
                show_status
                ;;
            6)
                show_logs
                ;;
            7)
                update_project
                ;;
            8)
                backup_database
                ;;
            9)
                restore_database
                ;;
            10)
                cleanup
                ;;
            11)
                health_check
                ;;
            0)
                print_info "خروج از برنامه..."
                exit 0
                ;;
            *)
                print_error "گزینه نامعتبر!"
                sleep 1
                ;;
        esac

        echo ""
        echo "برای ادامه Enter بزنید..."
        read -r
    done
}

# اجرای برنامه
main
