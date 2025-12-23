from datetime import date
from decimal import Decimal
from app.database.database import SessionLocal, Base, engine
from app.models.franchise import Franchise
from app.models.branch import Branch
from app.models.budget import Budget, Expense, BudgetStatus

# Ensure tables exist
Base.metadata.create_all(bind=engine)

def run():
    db = SessionLocal()
    try:
        # Seed only if empty
        if db.query(Franchise).count() == 0:
            f1 = Franchise(name="Joker Gayrimenkul - İstanbul", tax_number="1111111111", is_active=True)
            f2 = Franchise(name="Joker Gayrimenkul - Ankara", tax_number="2222222222", is_active=True)
            db.add_all([f1, f2])
            db.flush()

            branches = [
                Branch(name="Ataşehir Ofisi", city="İstanbul", franchise_id=f1.id),
                Branch(name="Kadıköy Ofisi", city="İstanbul", franchise_id=f1.id),
                Branch(name="Çankaya Ofisi", city="Ankara", franchise_id=f2.id),
            ]
            db.add_all(branches)
            db.flush()

            # Seed budgets
            budgets = [
                Budget(
                    franchise_id=f1.id,
                    branch_id=branches[0].id,
                    period="2025-12",
                    currency="TRY",
                    planned_amount=Decimal("150000.00"),
                    approved_amount=Decimal("145000.00"),
                    actual_amount=Decimal("87500.00"),
                    status=BudgetStatus.approved,
                ),
                Budget(
                    franchise_id=f1.id,
                    branch_id=branches[1].id,
                    period="2025-12",
                    currency="TRY",
                    planned_amount=Decimal("120000.00"),
                    approved_amount=Decimal("120000.00"),
                    actual_amount=Decimal("56000.00"),
                    status=BudgetStatus.approved,
                ),
                Budget(
                    franchise_id=f2.id,
                    branch_id=branches[2].id,
                    period="2025-12",
                    currency="TRY",
                    planned_amount=Decimal("100000.00"),
                    status=BudgetStatus.draft,
                ),
            ]
            db.add_all(budgets)
            db.flush()

            # Seed expenses
            expenses = [
                Expense(
                    budget_id=budgets[0].id,
                    franchise_id=f1.id,
                    branch_id=branches[0].id,
                    date=date(2025, 12, 5),
                    category="Marketing",
                    amount=Decimal("25000.00"),
                    note="Online advertising campaign",
                ),
                Expense(
                    budget_id=budgets[0].id,
                    franchise_id=f1.id,
                    branch_id=branches[0].id,
                    date=date(2025, 12, 10),
                    category="Operations",
                    amount=Decimal("32500.00"),
                    note="Office rent and utilities",
                ),
                Expense(
                    budget_id=budgets[1].id,
                    franchise_id=f1.id,
                    branch_id=branches[1].id,
                    date=date(2025, 12, 8),
                    category="Salaries",
                    amount=Decimal("40000.00"),
                    note="Monthly payroll",
                ),
            ]
            db.add_all(expenses)
            db.commit()
            print("Seeded demo franchises, branches, budgets, and expenses.")
        else:
            print("Database already seeded; skipping.")
    finally:
        db.close()

if __name__ == "__main__":
    run()
