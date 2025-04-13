import pandas as pd
import json

def convert_csv_to_json(csv_file, json_file=None):
    # อ่านไฟล์ CSV โดยคาดว่า header มีชื่อว่า
    # "category_1", "type", "category_2", "project", "approved", "increase", "decrease", "committed", "disbursed", "remaining"
    df = pd.read_csv(csv_file, encoding='utf-8')
    
    # กำหนดชื่อคอลัมน์ที่เป็นค่าตัวเลข
    numeric_columns = ['approved', 'increase', 'decrease', 'committed', 'disbursed', 'remaining']
    # แปลงค่าทั้งหมดให้เป็นตัวเลข ถ้าไม่สามารถแปลงได้จะได้ค่า 0.0
    for col in numeric_columns:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0.0)

    # --- สรุปข้อมูลโดย grouping ---
    # สรุปข้อมูลตาม "category_1"
    group_cat1 = df.groupby('category_1', as_index=False).agg({
        'approved': 'sum',
        'increase': 'sum',
        'decrease': 'sum',
        'committed': 'sum',
        'disbursed': 'sum',
        'remaining': 'sum',
        'project': 'count'  # ใช้นับจำนวนแถวในกลุ่ม เป็น project_count
    })
    
    # จัดรูปแบบให้เป็น dictionary โดยใช้ชื่อ category_1 เป็น key
    by_category_1 = {
        row['category_1']: {
            "approved": round(row['approved'], 2),
            "increase": round(row['increase'], 2),
            "decrease": round(row['decrease'], 2),
            "committed": round(row['committed'], 2),
            "disbursed": round(row['disbursed'], 2),
            "remaining": round(row['remaining'], 2),
            "project_count": int(row['project'])
        }
        for index, row in group_cat1.iterrows()
    }

    # สรุปข้อมูลตาม "type"
    group_type = df.groupby('type', as_index=False).agg({
        'approved': 'sum',
        'increase': 'sum',
        'decrease': 'sum',
        'committed': 'sum',
        'disbursed': 'sum',
        'remaining': 'sum',
        'project': 'count'
    })
    
    by_type = {
        row['type']: {
            "approved": round(row['approved'], 2),
            "increase": round(row['increase'], 2),
            "decrease": round(row['decrease'], 2),
            "committed": round(row['committed'], 2),
            "disbursed": round(row['disbursed'], 2),
            "remaining": round(row['remaining'], 2),
            "project_count": int(row['project'])
        }
        for index, row in group_type.iterrows()
    }

    # สรุปรวมของทุกโครงการ
    total_summary = {
        "approved": round(df['approved'].sum(), 2),
        "increase": round(df['increase'].sum(), 2),
        "decrease": round(df['decrease'].sum(), 2),
        "committed": round(df['committed'].sum(), 2),
        "disbursed": round(df['disbursed'].sum(), 2),
        "remaining": round(df['remaining'].sum(), 2),
        "project_count": int(df['project'].count())
    }
    
    # แปลงข้อมูลในแต่ละแถว (budget_data) ให้อยู่ในรูปแบบ list of dictionaries
    budget_data = df.to_dict(orient='records')
    
    # สร้างโครงสร้าง JSON ตามที่ต้องการ
    output = {
        "metadata": {
            "date": "21 ม.ค. 68",
            "source": "LPAO Budgeting Mini"
        },
        "summary": {
            "by_category_1": by_category_1,
            "by_type": by_type,
            "total": total_summary
        },
        "budget_data": budget_data
    }
    
    # แปลงเป็น JSON string โดยตั้งให้ ensure_ascii=False เพื่อรองรับตัวอักษรไทย
    json_data = json.dumps(output, ensure_ascii=False, indent=4)
    
    if json_file:
        # เขียนผลลัพธ์ลงในไฟล์
        with open(json_file, "w", encoding="utf-8") as f:
            f.write(json_data)
        print(f"JSON data written to {json_file}")
    else:
        # หากไม่ระบุไฟล์, แสดงผลใน console
        print(json_data)

if __name__ == "__main__":
    # กำหนดชื่อไฟล์ CSV ที่อัพโหลดมาจากผู้ใช้
    csv_input = "20250121-lpao-budgeting-mini.csv"
    # ถ้าต้องการให้บันทึกลงไฟล์ JSON กำหนด path ไว้ที่นี่ เช่น "output.json"
    json_output_file = "20250121-lpao-budgeting-mini.json"
    convert_csv_to_json(csv_input, json_output_file)
