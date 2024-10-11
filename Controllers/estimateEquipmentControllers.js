const generateFinalEstimate = require('');

const finalEstimateController = {
    async createFinalEstimate(req, res) {
        const { estimateId } = req.params; // Assuming estimateId is passed as a URL parameter

        try {
            // Generate the final estimate using the function
            const finalEstimate = await generateFinalEstimate(estimateId);

            // Return the final estimate as the response
            res.status(201).json({
                message: 'Final estimate generated successfully.',
                finalEstimate,
            });
        } catch (error) {
            console.error('Error generating final estimate:', error);
            res.status(500).json({
                message: 'An error occurred while generating the final estimate.',
                error: error.message,
            });
        }
    },

    async getFinalEstimate(req, res) {
        const { estimateId } = req.params; // Assuming estimateId is passed as a URL parameter

        try {
            // Fetch the final estimate from the database
            const finalEstimateResult = await db.query(
                'SELECT * FROM FinalEstimates WHERE estimate_id = $1',
                [estimateId]
            );

            const finalEstimate = finalEstimateResult.rows[0];

            if (!finalEstimate) {
                return res.status(404).json({
                    message: 'Final estimate not found.',
                });
            }

            // Return the final estimate as the response
            res.status(200).json({
                message: 'Final estimate retrieved successfully.',
                finalEstimate,
            });
        } catch (error) {
            console.error('Error retrieving final estimate:', error);
            res.status(500).json({
                message: 'An error occurred while retrieving the final estimate.',
                error: error.message,
            });
        }
    },
};

module.exports = finalEstimateController;
