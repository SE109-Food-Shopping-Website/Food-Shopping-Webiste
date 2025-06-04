from utils.get_response import get_response


class ResponseGenerator:
    def __init__(self, model):
        self.model = model

    def generate_response(self, query, context):
        try:
            print("="*20)
            print("Query:", query)
            print("Actual context passed to model:\n", context[:1500])  # chỉ in 1500 ký tự đầu
            print("="*20)
            print("context", context)
            instructions = """
Bạn là một chuyên viên trả lời câu hỏi dựa trên các dữ liệu được cung cấp.
Chỉ sử dụng dữ liệu bên dưới để trả lời. Nếu thông tin có liên quan gián tiếp, bạn vẫn có thể rút ra câu trả lời hợp lý từ đó.
Nếu không có bất kỳ thông tin nào liên quan, hãy trả lời: "Xin lỗi Bạn, mình không rõ câu hỏi của Bạn đang đề cập đến điều gì. Nếu Bạn có thể làm rõ hơn, mình sẽ rất vui lòng hỗ trợ! Cảm ơn Bạn đã tin tưởng Go GREEN ạ. Chúc Bạn một ngày tốt lành."

Trả lời ngắn gọn và đúng trọng tâm.
"""
            return get_response(query, context, instructions).content

        except Exception as e:
            print(f"Error: {str(e)}")  # In ra lỗi chi tiết
            raise ValueError(f"Error while generating response: {str(e)}")
