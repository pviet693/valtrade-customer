module.exports = {
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|png|scss)',
                locale: false,
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, must-revalidate',
                    }
                ],
            },
        ]
    },
}