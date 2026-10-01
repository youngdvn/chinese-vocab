export default function OfflinePage() {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold">
                    Bạn đang offline
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Vui lòng kiểm tra kết nối Internet và thử lại.
                </p>
            </div>
        </main>
    );
}