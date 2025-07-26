import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

class ReportGenerator:
    def __init__(self):
        """Initialize the ReportGenerator"""
        self.reports_dir = "session_reports"
        
        # create reports directory if it doesn't exist
        if not os.path.exists(self.reports_dir):
            os.makedirs(self.reports_dir)
            
        # initialize Gemini API
        self._initialize_genai()
    
    def _initialize_genai(self):
        """Initialize the Gemini API with the API key from .env"""
        load_dotenv()
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            print("Warning: GEMINI_API_KEY not found in .env file")
            return False
        
        genai.configure(api_key=self.api_key)
        return True
    
    def generate_report(self, session_file, prompt=None):
        """Generate a report from session data using Gemini API

        
        Args:
            session_file (str): Path to the session data JSON file
            prompt (str, optional): Custom prompt to use for report generation
                                   If None, a default prompt will be used
        
        Returns:
            str: Path to the saved report file, or None if generation failed
        """
        # check if API key is available
        if not hasattr(self, 'api_key') or not self.api_key:
            print("Failed to initialize Gemini API. Report generation skipped.")
            return None
        
        # read session data
        try:
            with open(session_file, 'r') as file:
                session_data = json.load(file)
            
            # create report filename based on session filename
            session_filename = os.path.basename(session_file)
            # Change the extension to .md
            report_filename = session_filename.replace('session_', 'report_').replace('.json', '.md')
            report_file = os.path.join(self.reports_dir, report_filename)
            
            # use default prompt if none provided
            if not prompt:
                prompt = """
                Conduct a comprehensive forensic behavioral analysis based on the provided interview session data.
                
                Your forensic report should include:
                
                1. EXECUTIVE SUMMARY:
                   - Brief overview of key findings
                   - Assessment of credibility indicators
                   - Highlight of critical moments during the interview
                
                2. EMOTIONAL PATTERN ANALYSIS:
                   - Detailed timeline of emotional states throughout the interview
                   - Identification of baseline emotional state
                   - Analysis of emotional shifts and their correlation with specific topics/questions
                   - Detection of incongruent emotional responses that may indicate deception
                
                3. DECEPTION ANALYSIS:
                   - Identification of potential deception cues based on emotional inconsistencies
                   - Analysis of micro-expressions that contradict stated emotions
                   - Assessment of emotional suppression or exaggeration
                   - Evaluation of response patterns when addressing critical questions
                
                4. BEHAVIORAL INDICATORS:
                   - Analysis of hand gestures and their psychological significance
                   - Assessment of self-soothing behaviors, defensive postures, or other stress indicators
                   - Identification of truthfulness indicators vs. potential deception markers
                   - Analysis of behavioral clusters that suggest psychological distress
                
                5. PSYCHOLOGICAL PROFILE:
                   - Assessment of subject's emotional stability throughout the session
                   - Identification of topics that trigger significant emotional responses
                   - Analysis of potential psychological vulnerabilities or defense mechanisms
                
                6. INVESTIGATIVE RECOMMENDATIONS:
                   - Suggested follow-up questions based on identified inconsistencies
                   - Topics that warrant further exploration
                   - Interview strategy recommendations for future sessions
                   - Areas where additional evidence might be needed

                
                7. METHODOLOGICAL LIMITATIONS:
                   - Acknowledge limitations of the analysis
                   - Confidence level in findings

                
                Format the report professionally with clear section headers, timestamps where relevant, and evidence-based conclusions.
                """
            
            # call Gemini API with the prompt and raw session data
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(f"{prompt}\n\nSession Start Time: {session_data.get('start_time')}\nSession End Time: {session_data.get('end_time')}\n\n{json.dumps(session_data)}")
            
            # save the report with UTF-8 encoding to handle all Unicode characters
            # Write the raw text content to the .md file
            with open(report_file, 'w', encoding='utf-8') as file:
                file.write(response.text)
                
            print(f"Report generated and saved to {report_file}")
            return report_file
            
        except Exception as e:
            print(f"Error generating report: {e}")
            return None