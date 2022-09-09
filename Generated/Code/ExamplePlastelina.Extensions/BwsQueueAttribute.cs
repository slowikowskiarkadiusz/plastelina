using System;

namespace ExamplePlastelina.Extensions
{
    [AttributeUsage(System.AttributeTargets.Class | System.AttributeTargets.Struct | System.AttributeTargets.Enum)]
    public class BwsQueueAttribute : Attribute
    {
        public string QueueName { get; private set; }

        public BwsQueueAttribute(string queueName)
        {
            QueueName = queueName;
        }
    }
}
