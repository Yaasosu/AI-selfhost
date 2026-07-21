from prometheus_client import Counter, Histogram

# Metric for counting messages sent by user
MESSAGES_SENT_TOTAL = Counter(
    "app_messages_sent_total",
    "Total number of messages sent by users",
    ["user_id", "ai_model"],
)

# Metric for counting messages replied by assistant
MESSAGES_REPLIED_TOTAL = Counter(
    "app_messages_replied_total",
    "Total number of messages replied by assistant",
    ["ai_model"],
)

# Metric for tracking response latency of Ollama
OLLAMA_RESPONSE_DURATION = Histogram(
    "app_ollama_response_duration_seconds",
    "Time taken for Ollama model to generate responses",
    ["ai_model"],
)
