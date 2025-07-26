import os
import json
from app.generators.report_generator import ReportGenerator  # use absolute import

class ReportManager:
    def __init__(self, reports_dir="session_reports"):
        """Initialize the ReportManager"""
        self.reports_dir = reports_dir
        
        # create reports directory if it doesn't exist
        if not os.path.exists(self.reports_dir):
            os.makedirs(self.reports_dir)
    
    def generate_report(self, session_file):
        """Generate a report from session data
        
        Args:
            session_file (str): Path to the session data JSON file
        
        Returns:
            str: Path to the saved report file, or None if generation failed
        """
        with open(session_file, 'r') as file:
            session_data = json.load(file)
        
        if not session_data.get("frames") or len(session_data["frames"]) == 0:
            print("No frames captured in this session. Report generation skipped.")
            return None
            
        print("Generating session report...")
        report_gen = ReportGenerator()
        report_file = report_gen.generate_report(session_file)
        if report_file:
            print(f"Report saved to {report_file}")
            return report_file
        return None
            
    def view_past_reports(self):
        """View list of past session reports and allow user to select one to view"""
        report_files = [f for f in os.listdir(self.reports_dir) if f.endswith('.json')]
        
        if not report_files:
            print("No saved reports found.")
            input("Press Enter to continue...")
            return
        
        print("\nSaved Reports:")
        for i, file in enumerate(report_files):
            print(f"{i+1}: {file}")
        
        choice = input("\nEnter report number to view (or press Enter to go back): ")
        if not choice:
            return
        
        try:
            index = int(choice) - 1
            if 0 <= index < len(report_files):
                self.display_report_data(report_files[index])
            else:
                print("Invalid report number.")
        except ValueError:
            print("Invalid input.")
        
        input("Press Enter to continue...")
    
    def display_report_data(self, filename):
        """Display report content"""
        filepath = os.path.join(self.reports_dir, filename)
        
        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                report_data = file.read()
                
            print("\n" + "="*50)
            print(f"Report: {filename}")
            print("="*50)
            print(report_data)
                
        except FileNotFoundError:
            print(f"Error: Report file {filename} not found.")
        except Exception as e:
            print(f"Error reading report file: {e}")