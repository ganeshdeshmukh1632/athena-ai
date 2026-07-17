from app.models.schemas import AnalyzeRequest, AnalyzeResponse


class AthenaOrchestrator:
    """
    Stub orchestrator. Real version will:
      1. Classify intent (see docs/DECISION_ENGINE.md)
      2. Select agents (Technical, Fundamental, News, Risk...)
      3. Fetch data, run agents in parallel
      4. Merge results into one structured answer
    For now, returns a fixed dummy response to prove the pipeline works.
    """

    def run(self, request: AnalyzeRequest) -> AnalyzeResponse:
        return AnalyzeResponse(
            summary=f"Dummy analysis for: '{request.question}'",
            evidence=["Placeholder evidence point 1", "Placeholder evidence point 2"],
            risks=["Placeholder risk 1"],
            confidence=0.5,
            sources=["stub-data"],
        )


orchestrator = AthenaOrchestrator()
