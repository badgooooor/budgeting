import csv
import json
from datetime import datetime
import re

def clean_number(value):
    """ทำความสะอาดตัวเลขจาก string"""
    if not value:
        return 0
    # ลบเครื่องหมายคอมม่าและแปลงเป็น float
    return float(re.sub(r'[^\d.-]', '', value))

def process_csv_to_json(csv_file, json_file):
    # อ่านข้อมูลจาก CSV
    projects = []
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            project = {
                'id': row['no'],
                'name': row['project'],
                'budget': clean_number(row['budget']),
                'decrease': clean_number(row['decrease']),
                'increase': clean_number(row['increase']),
                'disbursed': clean_number(row['disbursement']),
                'remaining': clean_number(row['remaining']),
                'coordinates': None  # เตรียมไว้สำหรับข้อมูลพิกัด
            }
            projects.append(project)

    # สร้างโครงสร้างข้อมูลสรุป
    summary = {
        'by_category_1': {},
        'total': {
            'disbursed': 0,
            'committed': 0,
            'remaining': 0,
            'approved': 0
        },
        'metadata': {
            'date': datetime.now().strftime('%Y-%m-%d')
        }
    }

    # คำนวณข้อมูลสรุป
    for project in projects:
        # เพิ่มในหมวดหมู่ (ในที่นี้ใช้ชื่อโครงการเป็นหมวดหมู่)
        category = project['name'].split('โครงการ')[0] if 'โครงการ' in project['name'] else 'อื่นๆ'
        if category not in summary['by_category_1']:
            summary['by_category_1'][category] = {
                'approved': 0,
                'increase': 0,
                'decrease': 0,
                'committed': 0,
                'disbursed': 0,
                'remaining': 0,
                'project_count': 0
            }
        
        summary['by_category_1'][category]['approved'] += project['budget']
        summary['by_category_1'][category]['increase'] += project['increase']
        summary['by_category_1'][category]['decrease'] += project['decrease']
        summary['by_category_1'][category]['disbursed'] += project['disbursed']
        summary['by_category_1'][category]['remaining'] += project['remaining']
        summary['by_category_1'][category]['project_count'] += 1

        # คำนวณยอดรวมทั้งหมด
        summary['total']['approved'] += project['budget']
        summary['total']['disbursed'] += project['disbursed']
        summary['total']['remaining'] += project['remaining']

    # สร้างไฟล์ JSON
    output = {
        'summary': summary,
        'budget_data': projects,
        'metadata': {
            'date': datetime.now().strftime('%Y-%m-%d'),
            'total_projects': len(projects)
        }
    }

    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    csv_file = '../public/20250522-eplan.csv'
    json_file = '../public/20250522-eplan.json'
    process_csv_to_json(csv_file, json_file)
    print(f'แปลงข้อมูลเสร็จสิ้น: {json_file}')